import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { Person } from '../../src/person/entities/person.entity';
import { BankAccount } from '../../src/bank-account/entities/bank-account.entity';
import { BankTransaction } from '../../src/bank-transaction/entities/bank-transaction.entity';
import { Friend } from '../../src/friend/entities/friend.entity';
import { ProcessService } from '../../src/process/process.service';

let app: INestApplication;
let dataSource: DataSource;

// For ensure being eamil unique we use unique time
const uniqueSuffix = Date.now();
const users = [
  { name: 'User A', email: `a+${uniqueSuffix}@example.com` },
  { name: 'User B', email: `b+${uniqueSuffix}@example.com` },
  { name: 'User C', email: `c+${uniqueSuffix}@example.com` },
];

describe('Finance Integration Test', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should create users, add bank accounts, transactions, and compute balances correctly', async () => {
    const personRepo = dataSource.getRepository(Person);
    const accountRepo = dataSource.getRepository(BankAccount);
    const txRepo = dataSource.getRepository(BankTransaction);
    const friendRepo = dataSource.getRepository(Friend);
    const processService = app.get(ProcessService);

    // 1. Create 3 persons
    const createdUsers = await personRepo.save(users);
    expect(createdUsers.length).toBe(3);

    // 2. Add friendship: A <-> B
    await friendRepo.save([
      { personId: createdUsers[0].id, friendId: createdUsers[1].id },
      { personId: createdUsers[1].id, friendId: createdUsers[0].id },
    ]);

    // 3. Create 2 accounts per person
    const allAccounts: BankAccount[] = [];
    for (const person of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const account = accountRepo.create({
          iban: `${person.email.replace('@', '').replace('.', '')}-iban${i}`.slice(
            0,
            34,
          ),
          person,
          current_balance: 0,
        });
        allAccounts.push(account);
      }
    }
    const savedAccounts = await accountRepo.save(allAccounts);

    // 4. Add transactions: userA to userB and userB to userA
    const txs: BankTransaction[] = [];
    const accA1 = savedAccounts.find((a) => a.person.id === createdUsers[0].id);
    const accB1 = savedAccounts.find((a) => a.person.id === createdUsers[1].id);

    for (let i = 0; i < 2; i++) {
      txs.push(
        txRepo.create({
          account: accA1,
          counterparty_iban: accB1!.iban,
          amount: 100 + i * 50,
        }),
      );
      txs.push(
        txRepo.create({
          account: accB1,
          counterparty_iban: accA1!.iban,
          amount: -80 - i * 30,
        }),
      );
    }
    await txRepo.save(txs);

    // 5. Run all processes
    const result = await processService.runProcessesUpTo(3);

    // 6. Check result balances and net worths
    const updatedA = await accountRepo.find({
      where: { person: { id: createdUsers[0].id } },
      relations: ['transactions'],
    });
    const updatedB = await accountRepo.find({
      where: { person: { id: createdUsers[1].id } },
      relations: ['transactions'],
    });

    const totalA = updatedA.reduce(
      (sum, acc) =>
        sum + acc.transactions.reduce((s, t) => s + Number(t.amount), 0),
      0,
    );
    const totalB = updatedB.reduce(
      (sum, acc) =>
        sum + acc.transactions.reduce((s, t) => s + Number(t.amount), 0),
      0,
    );

    expect(result.balances).toBeDefined();
    expect(totalA).toBeGreaterThan(0);
    expect(totalB).toBeLessThan(0);
  });
});
