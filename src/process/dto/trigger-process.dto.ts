import { IsIn, IsNumber } from 'class-validator';
export class TriggerProcessDto {
  @IsNumber()
  @IsIn([1, 2, 3])
  process_id: number;
}
