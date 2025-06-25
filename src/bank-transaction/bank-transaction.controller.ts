import { Controller } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';

@Controller('bank-transaction')
export class BankTransactionController {
  constructor(private readonly bankTransactionService: BankTransactionService) {}
}
