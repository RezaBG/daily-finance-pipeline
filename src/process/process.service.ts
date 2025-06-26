import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProcessRun } from './entities/process.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { BankTransaction } from '../bank-transaction/entities/bank-transaction.entity';
import { Person } from '../person/entities/person.entity';
import { Friend } from '../friend/entities/friend.entity';
import { CreateTransactionDto } from '../bank-transaction/dto/bank-transaction-request';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { BankTransactionService } from 'src/bank-transaction/bank-transaction.service';

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
  async runProcessesUpTo(processId: number) {
    this.logger.log(`Running processes up to ID: ${processId}`);
    if (processId >= 1) await this.runBalanceComputation();
    if (processId >= 2) await this.runNetWorthComputation();
    if (processId >= 3) await this.runBorrowingComputation();
    await this.processRunRepo.insert({ process_id: processId });
  }

  // Process 1: Compute balance per account
  async runBalanceComputation() {
    this.logger.log('Running balance computation...');
    const accounts = await this.accountRepo.find({
      relations: ['transactions'],
    });
    for (const account of accounts) {
      const total = account.transactions.reduce(
        (sum, tx) => sum + Number(tx.amount),
        0,
      );
      account.current_balance = total;
      await this.accountRepo.save(account);
    }
    this.logger.log('Balances updated successfully.');
  }

  // Process 2: Compute net worth per person
  async runNetWorthComputation() {
    this.logger.log('Running net worth computation...');
    const people = await this.personRepo.find({ relations: ['accounts'] });
    for (const person of people) {
      const netWorth = person.accounts.reduce(
        (sum, acc) => sum + Number(acc.current_balance),
        0,
      );
      this.logger.debug(`Net worth of ${person.name}: ${netWorth}`);
    }
    this.logger.log('Net worth calculation complete.');
  }

  // Process 3: Compute borrowing capacity
  async runBorrowingComputation() {
    this.logger.log('Running borrowing computation...');
    const people = await this.personRepo.find({
      relations: [
        'accounts',
        'friends',
        'friends.friend',
        'friends.friend.accounts',
      ],
    });
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
      this.logger.log(`${person.name} can borrow up to: ${maxBorrow}`);
    }
    this.logger.log('Borrowing capacity computation complete.');
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
