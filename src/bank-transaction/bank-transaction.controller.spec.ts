import { Test, TestingModule } from '@nestjs/testing';
import { BankTransactionController } from './bank-transaction.controller';
import { BankTransactionService } from './bank-transaction.service';

describe('BankTransactionController', () => {
  let controller: BankTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankTransactionController],
      providers: [BankTransactionService],
    }).compile();

    controller = module.get<BankTransactionController>(BankTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
