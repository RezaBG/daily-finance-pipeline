import { Module } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransaction } from './entities/bank-transaction.entity';
import { BankAccount } from 'src/bank-account/entities/bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction, BankAccount])],
  controllers: [BankTransactionController],
  providers: [BankTransactionService],
  exports: [BankTransactionService],
})
export class BankTransactionModule {}
