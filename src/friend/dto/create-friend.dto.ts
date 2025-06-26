import { IsUUID } from 'class-validator';

export class CreateFriendDto {
  @IsUUID()
  personId: string;

  @IsUUID()
  friendId: string;
}
