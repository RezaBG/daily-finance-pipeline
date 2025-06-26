import { ConflictException, Injectable } from '@nestjs/common';
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
  async remove(id: string): Promise<void> {
    await this.personRepository.delete(id);
  }
}
