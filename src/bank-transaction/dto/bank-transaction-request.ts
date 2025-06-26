import { IsString, IsNumber } from 'class-validator';
export class CreateTransactionDto {
  @IsString()
  account_iban: string;

  @IsString()
  counterparty_iban: string;

  @IsNumber()
  amount: number;
}
