import { DataSource } from 'typeorm';
import { Person } from '../person/entities/person.entity';

/**
 * Seed 10 mock Person records with unique names and emails.
 * This function is intended to be used as part of the global seed runner.
 */
export async function seedPersons(dataSource: DataSource): Promise<Person[]> {
  const personRepo = dataSource.getRepository(Person);

  const people: Partial<Person>[] = [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { name: 'Bob Smith', email: 'bob.smith@example.com' },
    { name: 'Charlie Lee', email: 'charlie.lee@example.com' },
    { name: 'David Kim', email: 'david.kim@example.com' },
    { name: 'Emma Davis', email: 'emma.davis@example.com' },
    { name: 'Frank Miller', email: 'frank.miller@example.com' },
    { name: 'Grace Nguyen', email: 'grace.nguyen@example.com' },
    { name: 'Henry Moore', email: 'henry.moore@example.com' },
    { name: 'Isabella Green', email: 'isabella.green@example.com' },
    { name: 'Jack Wilson', email: 'jack.wilson@example.com' },
  ];

  const inserted = await personRepo.save(people);
  console.log('add 10 users');

  return inserted;
}
