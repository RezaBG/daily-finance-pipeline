export class BorrowingResultDto {
  person_id: string;
  max_borrow_amount: number;
  from_friends: { friend_id: string; can_borrow: number }[];
}
