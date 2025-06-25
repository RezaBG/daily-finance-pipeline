import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('nightly_process_runs')
export class ProcessRun {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' }) // 1 = balances, 2 = net worth, 3 = borrowing
  process_id: number;

  @CreateDateColumn()
  run_at: Date;
}
