import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessRun } from './entities/process.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { BankTransaction } from '../bank-transaction/entities/bank-transaction.entity';
import { Person } from '../person/entities/person.entity';
import { Friend } from '../friend/entities/friend.entity';
import { BankTransactionService } from '../bank-transaction/bank-transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcessRun,
      BankAccount,
      BankTransaction,
      Person,
      Friend,
    ]),
  ],
  controllers: [ProcessController],
  providers: [ProcessService, BankTransactionService],
})
export class ProcessModule {}
