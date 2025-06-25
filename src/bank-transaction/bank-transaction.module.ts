import { Module } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';
import { BankTransactionController } from './bank-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransaction } from './entities/bank-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction])],
  controllers: [BankTransactionController],
  providers: [BankTransactionService],
})
export class BankTransactionModule {}
