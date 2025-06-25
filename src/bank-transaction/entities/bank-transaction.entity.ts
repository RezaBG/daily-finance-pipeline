import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BankAccount } from '../../bank-account/entities/bank-account.entity';

@Entity('bank_transactions')
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 34 })
  counterparty_iban: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => BankAccount, (account) => account.transactions, {
    onDelete: 'CASCADE',
  })
  account: BankAccount;
}
