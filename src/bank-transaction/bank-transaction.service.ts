import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransaction } from './entities/bank-transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { CreateTransactionDto } from './dto/bank-transaction-request';

@Injectable()
export class BankTransactionService {
  constructor(
    @InjectRepository(BankTransaction)
    private bankTransactionRepository: Repository<BankTransaction>,
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTransactionDto): Promise<BankTransaction> {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: {
        iban: dto.account_iban,
      },
    });
    if (dto.account_iban == dto.counterparty_iban) {
      throw new ConflictException(
        'You can not send money to the same bank account',
      );
    }
    if (!bankAccount) {
      throw new NotFoundException('The source IBAN not found');
    }
    const counterpartyIBAN = await this.bankAccountRepository.findOne({
      where: {
        iban: dto.counterparty_iban,
      },
    });
    if (!counterpartyIBAN) {
      throw new NotFoundException('The destination IBAN not found');
    }
    const BankTransaction = this.bankTransactionRepository.create(dto);
    BankTransaction.account = bankAccount;
    return this.bankTransactionRepository.save(BankTransaction);
  }

  // ACID - ATOMIC
  async createBulk(dtos: CreateTransactionDto[]): Promise<BankTransaction[]> {
    if (!dtos || dtos.length === 0) {
      throw new BadRequestException('No transactions provided');
    }
    return await this.dataSource.transaction(async (manager) => {
      const transactionsToSave: BankTransaction[] = [];
      for (const dto of dtos) {
        const account = await manager.findOne(BankAccount, {
          where: { iban: dto.account_iban },
        });
        if (!account) {
          throw new NotFoundException(
            `BankAccount not found: ${dto.account_iban}`,
          );
        }
        //TODO:  check iban counter party
        const transaction = manager.create(BankTransaction, {
          amount: dto.amount,
          // TODO ADD: description: dto.description,
          account: account,
          counterparty_iban: dto.counterparty_iban,
          created_at: new Date(), // I'll manage to to recive from user in future
        });
        transactionsToSave.push(transaction);
      }
      console.log('==>>', transactionsToSave);
      return await manager.save(BankTransaction, transactionsToSave);
    });
  }
}
