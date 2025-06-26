import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { BankAccount } from '../bank-account/entities/bank-account.entity';
import { BankTransaction } from '../bank-transaction/entities/bank-transaction.entity';
import { Friend } from '../friend/entities/friend.entity';

import { Person } from '../person/entities/person.entity';
import { seedPersons } from './person.seed';
// import { seedBankAccount } from './bank-account.seed';

// import { seedAccounts } from './bank-account.seed';
// import { seedFriends } from './friend.seed';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Person, Friend, BankAccount, BankTransaction],
  synchronize: false,
  logging: false,
});

async function seed() {
  await AppDataSource.initialize();

  const persons = await seedPersons(AppDataSource);

  console.log('List of user mock data: ', persons);

  // await seedAccounts(AppDataSource, persons);
  // await seedFriends(AppDataSource, persons);

  await AppDataSource.destroy();
  console.log('✅ All seeds complete');
}

seed().catch((err) => {
  console.error('❌ Seeding failed', err);
});
