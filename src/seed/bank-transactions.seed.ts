import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { BankTransaction } from '../bank-transaction/entities/bank-transaction.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';

export async function seedBankTransactions(dataSource: DataSource) {
  const txRepo = dataSource.getRepository(BankTransaction);
  const accountRepo = dataSource.getRepository(BankAccount);

  const allAccounts = await accountRepo.find();

  if (allAccounts.length < 2) {
    throw new Error('Need at least 2 bank accounts to create transactions.');
  }

  const transactions: BankTransaction[] = [];

  for (let i = 0; i < 50; i++) {
    const sourceIndex = faker.number.int({
      min: 0,
      max: allAccounts.length - 1,
    });
    let targetIndex = faker.number.int({ min: 0, max: allAccounts.length - 1 });

    while (targetIndex === sourceIndex) {
      targetIndex = faker.number.int({ min: 0, max: allAccounts.length - 1 });
    }

    const sourceAccount = allAccounts[sourceIndex];
    const targetAccount = allAccounts[targetIndex];

    const amount = Number(
      faker.finance.amount({ min: -500, max: 500, dec: 2 }),
    );
    const tx = txRepo.create({
      account: sourceAccount,
      counterparty_iban: targetAccount.iban,
      amount,
    });

    transactions.push(tx);
  }

  await txRepo.save(transactions);
  console.log('Seeded 50 random bank transactions between real accounts');
}
