import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/person-create.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  // create
  async create(dto: CreatePersonDto): Promise<Person> {
    const existPerson = await this.personRepository.findOne({
      where: { email: dto.email },
    });
    if (existPerson) {
      throw new ConflictException('Dublicate Email');
    }
    const person = this.personRepository.create(dto);
    return this.personRepository.save(person);
  }

  findAll(): Promise<Person[]> {
    return this.personRepository.find({
      relations: ['accounts', 'friends', 'friendOf'],
    });
  }

  findOne(id: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { id },
      relations: ['accounts', 'friends', 'friendOf'],
    });
  }

  // remove
  async remove(id: string): Promise<void> {
    await this.personRepository.delete(id);
  }

  async getBorrowingCapacity(personId: string): Promise<{
    personId: string;
    name: string;
    can_borrow_up_to: number;
  }> {
    const person = await this.personRepository.findOne({
      where: { id: personId },
      relations: [
        'accounts',
        'friends',
        'friends.friend',
        'friends.friend.accounts',
      ],
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const myBalance = person.accounts.reduce(
      (sum, acc) => sum + Number(acc.current_balance),
      0,
    );

    let maxBorrow = 0;

    for (const friendLink of person.friends) {
      const friend = friendLink.friend;
      const friendBalance = friend.accounts.reduce(
        (sum, acc) => sum + Number(acc.current_balance),
        0,
      );

      if (friendBalance > myBalance) {
        maxBorrow += friendBalance - myBalance;
      }
    }

    return {
      personId: person.id,
      name: person.name,
      can_borrow_up_to: maxBorrow,
    };
  }
}
