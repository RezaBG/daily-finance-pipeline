import { Entity, ManyToOne, PrimaryColumn, Check } from 'typeorm';
import { Person } from '../../person/entities/person.entity';

@Entity('person_friends')
@Check(`"personId" <> "friendId"`)
export class Friend {
  @PrimaryColumn()
  personId: string;

  @PrimaryColumn()
  friendId: string;

  @ManyToOne(() => Person, (person) => person.friends, { onDelete: 'CASCADE' })
  person: Person;

  @ManyToOne(() => Person, (person) => person.friendOf, { onDelete: 'CASCADE' })
  friend: Person;
}
