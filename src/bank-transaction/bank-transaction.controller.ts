import { Body, Controller, Post } from '@nestjs/common';
import { BankTransactionService } from './bank-transaction.service';
import { CreateTransactionDto } from './dto/bank-transaction-request';
import { TransactionResponseDto } from './dto/bank-transaction-response';

@Controller('bank-transaction')
export class BankTransactionController {
  constructor(
    private readonly bankTransactionService: BankTransactionService,
  ) {}
  @Post()
  Create(@Body() dto: CreateTransactionDto) {
    return this.bankTransactionService.create(dto);
  }

  @Post('/Bulk')
  CreateBulk(@Body() dto: TransactionResponseDto[]) {
    return this.bankTransactionService.createBulk(dto);
  }
}
