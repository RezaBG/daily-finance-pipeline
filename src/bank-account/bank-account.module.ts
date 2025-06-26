import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount]), PersonModule],
  controllers: [BankAccountController],
  providers: [BankAccountService],
})
export class BankAccountModule {}
