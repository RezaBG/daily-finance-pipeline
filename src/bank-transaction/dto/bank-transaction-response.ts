export class TransactionResponseDto {
  id: string;
  account_iban: string;
  counterparty_iban: string;
  amount: number;
  created_at: Date;
}
