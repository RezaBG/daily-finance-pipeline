import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account-dto';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    private personService: PersonService,
  ) {}

  async create(dto: CreateBankAccountDto): Promise<BankAccount> {
    const person = await this.personService.findOne(dto.personId);
    if (!person) {
      throw new NotFoundException('person not found');
    }
    const IsIBANExist = await this.bankAccountRepository.findOne({
      where: { iban: dto.iban },
    });
    console.log(IsIBANExist);
    if (IsIBANExist) {
      throw new ConflictException('this IBAN already exist');
    }
    const bankAccount = this.bankAccountRepository.create(dto);
    bankAccount.person = person;
    return this.bankAccountRepository.save(bankAccount);
  }
  findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepository.find({
      relations: ['person', 'transactions'],
    });
  }
  findOne(id: string): Promise<BankAccount | null> {
    return this.bankAccountRepository.findOne({
      where: { iban: id },
      relations: ['person', 'transactions'],
    });
  }
  // TODO: add soft remove
}
