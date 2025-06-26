import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
export class CreateBankAccountDto {
  @IsString()
  iban: string;

  @IsNumber()
  @IsOptional()
  current_balance: number;

  @IsUUID()
  personId: string;
}
