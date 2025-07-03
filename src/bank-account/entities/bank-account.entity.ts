import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Person } from '../../person/entities/person.entity';
import { BankTransaction } from '../../bank-transaction/entities/bank-transaction.entity';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryColumn({ length: 34 })
  iban: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  current_balance: number;

  @Column({ type: 'timestamp', nullable: true })
  last_balance_computed_at: Date;

  @ManyToOne(() => Person, (person) => person.accounts, { onDelete: 'CASCADE' })
  person: Person;

  @OneToMany(() => BankTransaction, (tx) => tx.account)
  transactions: BankTransaction[];
}
