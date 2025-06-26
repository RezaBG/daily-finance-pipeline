import { DataSource } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { faker } from '@faker-js/faker';

// Creates 5 bank accounts and assigns them randomly (2-5 per person) to persons.

export async function seedBankAccounts(
  dataSource: DataSource,
): Promise<BankAccount[]> {
  const personRepo = dataSource.getRepository(Person);
  const accountRepo = dataSource.getRepository(BankAccount);

  const persons = await personRepo.find();
  if (persons.length === 0) {
    throw new Error('No persons found. Please run seedPersons first.');
  }

  const allAccounts: BankAccount[] = [];

  for (let i = 0; i < 5; i++) {
    const owner = faker.helpers.arrayElement(persons);
    const account = accountRepo.create({
      iban: faker.finance
        .iban({ formatted: true })
        .replace(/\s/g, '')
        .substring(0, 34),
      current_balance: parseFloat(
        faker.finance.amount({ min: 1, max: 10000, dec: 2 }),
      ),
      person: owner,
    });

    allAccounts.push(account);
  }

  const inserted = await accountRepo.save(allAccounts);
  console.log(`Seeded ${inserted.length} bank accounts`);

  return inserted;
}
