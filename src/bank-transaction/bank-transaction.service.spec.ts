import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionService } from './bank-transaction.service';

describe('BankTransactionService', () => {
  let service: BankTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankTransactionService],
    }).compile();

    service = module.get<BankTransactionService>(BankTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
