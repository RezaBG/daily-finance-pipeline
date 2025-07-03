import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { ProcessRun } from './entities/process.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { BankTransaction } from '../bank-transaction/entities/bank-transaction.entity';
import { Person } from '../person/entities/person.entity';
import { Friend } from '../friend/entities/friend.entity';
import { CreateTransactionDto } from '../bank-transaction/dto/bank-transaction-request';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { BankTransactionService } from '../bank-transaction/bank-transaction.service';

interface BalanceComputationResult {
  iban: string;
  new_balance: number;
  person: Person;
}

interface BalanceComputationSummary {
  total_accounts: number;
  processed_accounts: number;
  balances: BalanceComputationResult[];
}

export interface ProcessRunResult {
  balances?: BalanceComputationSummary;
  netWorths?: NetWorthResult[];
  borrowings?: BorrowingResult[];
}

interface NetWorthResult {
  personId: string;
  name: string;
  net_worth: number;
}

interface BorrowingResult {
  personId: string;
  name: string;
  can_borrow_up_to: number;
}

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);
  constructor(
    private readonly transactionService: BankTransactionService,
    private readonly dataSource: DataSource,
    @InjectRepository(ProcessRun)
    private processRunRepo: Repository<ProcessRun>,
    @InjectRepository(BankAccount)
    private accountRepo: Repository<BankAccount>,
    @InjectRepository(BankTransaction)
    private transactionRepo: Repository<BankTransaction>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    @InjectRepository(Friend)
    private friendRepo: Repository<Friend>,
  ) {}

  // Entry point from webhook
  async runProcessesUpTo(processId: number): Promise<ProcessRunResult> {
    const result: ProcessRunResult = {};

    this.logger.log(`Running processes up to ID: ${processId}`);
    if (processId >= 1) {
      result.balances = await this.runBalanceComputation();
    }

    if (processId >= 2) {
      result.netWorths = await this.runNetWorthComputation();
    }

    if (processId >= 3) {
      result.borrowings = await this.runBorrowingComputation();
    }
    console.log(result);
    await this.processRunRepo.insert({ process_id: processId });
    return result;
  }

  // Process 1: Compute balance per account
  async runBalanceComputation(): Promise<BalanceComputationSummary> {
    this.logger.log('Starting balance computation procces');
    const start = Date.now();
    const now = new Date();

    try {
      return await this.accountRepo.manager.transaction(async (manager) => {
        const accounts = await manager.find(BankAccount, {
          relations: ['person'],
        });

        this.logger.log(`Fetch ${accounts.length} accounts from DB`);

        const updated: BalanceComputationResult[] = [];

        for (const account of accounts) {
          const newTransactions = await manager.find(BankTransaction, {
            where: {
              account: { iban: account.iban },
              created_at: MoreThan(
                account.last_balance_computed_at || new Date(0),
              ),
            },
          });
          if (newTransactions.length === 0) {
            continue; // nothing to do for this account
          }

          const newTotal = newTransactions.reduce(
            (sum, tx) => sum + Number(tx.amount),
            0,
          );

          account.current_balance = Number(account.current_balance) + newTotal;
          account.last_balance_computed_at = now;

          updated.push({
            iban: account.iban,
            person: account.person,
            new_balance: Number(account.current_balance.toFixed(2)),
          });
        }

        await manager.save(accounts);

        this.logger.log(`Updated balances for ${updated.length} accounts`);
        const duration = Date.now() - start;
        this.logger.log(
          `Incremental balance computation finished in ${duration}ms`,
        );

        return {
          total_accounts: accounts.length,
          processed_accounts: updated.length,
          balances: updated,
        };
      });
    } catch (error) {
      this.logger.log(
        'Incremental balance computation failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  // Process 2: Compute net worth per person
  async runNetWorthComputation(): Promise<
    { personId: string; name: string; net_worth: number }[]
  > {
    const people = await this.personRepo.find({ relations: ['accounts'] });
    const result: { personId: string; name: string; net_worth: number }[] = [];

    for (const person of people) {
      const netWorth = person.accounts.reduce(
        (sum, acc) => sum + Number(acc.current_balance),
        0,
      );

      result.push({
        personId: person.id,
        name: person.name,
        net_worth: netWorth,
      });
    }

    return result;
  }

  // Process 3: Compute borrowing capacity
  async runBorrowingComputation() {
    const people = await this.personRepo.find({
      relations: [
        'accounts',
        'friends',
        'friends.friend',
        'friends.friend.accounts',
      ],
    });

    // console.log(people);

    const result: {
      personId: string;
      name: string;
      can_borrow_up_to: number;
    }[] = [];

    for (const person of people) {
      const myBalance = person.accounts.reduce(
        (sum, acc) => sum + Number(acc.current_balance),
        0,
      );
      let maxBorrow = 0;

      for (const friendLink of person.friends) {
        const friend = friendLink.friend;
        const friendBalance = friend.accounts.reduce(
          (sum, acc) => sum + Number(acc.current_balance),
          0,
        );
        if (friendBalance > myBalance) {
          maxBorrow += friendBalance - myBalance;
        }
      }

      result.push({
        personId: person.id,
        name: person.name,
        can_borrow_up_to: maxBorrow,
      });
    }

    return result;
  }

  async handleWebhook() {
    await this.createBankTransactionsFromJson();
    return { message: `Webhock runned` };
  }

  async createBankTransactionsFromJson() {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'src/data',
      'transactions.json',
    );
    let raw: string;
    try {
      raw = await readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to read transactions file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        'Invalid JSON format in transactions file: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid transaction data in JSON file.');
    }
    const transactions: CreateTransactionDto[] =
      parsed as CreateTransactionDto[];
    await this.transactionService.createBulk(transactions);
  }
}
