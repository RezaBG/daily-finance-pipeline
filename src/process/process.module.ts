import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessRun } from './entities/process.entity';
import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { BankTransaction } from 'src/bank-transaction/entities/bank-transaction.entity';
import { Person } from 'src/person/entities/person.entity';
import { Friend } from 'src/friend/entities/friend.entity';

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
  providers: [ProcessService],
})
export class ProcessModule {}
