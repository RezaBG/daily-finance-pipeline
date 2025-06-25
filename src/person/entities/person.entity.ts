import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BankAccount } from '../../bank-account/entities/bank-account.entity';
import { Friend } from '../../friend/entities/friend.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @OneToMany(() => BankAccount, (account) => account.person)
  accounts: BankAccount[];

  @OneToMany(() => Friend, (friend) => friend.person)
  friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.friend)
  friendOf: Friend[];
}
