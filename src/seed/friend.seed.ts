import { DataSource } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { Friend } from '../friend/entities/friend.entity';
import { faker } from '@faker-js/faker';

export async function seedFriends(dataSource: DataSource): Promise<Friend[]> {
  const personRepo = dataSource.getRepository(Person);
  const friendRepo = dataSource.getRepository(Friend);

  const people = await personRepo.find();
  if (people.length < 2) {
    throw new Error('At least 2 persons are needed to create friendships.');
  }

  const friendshipMap = new Set<string>();
  const friendships: Friend[] = [];

  for (const person of people) {
    const others = people.filter((p) => p.id !== person.id);
    const friendCount = faker.number.int({ min: 0, max: 4 });
    const selectedFriends = faker.helpers.arrayElements(others, friendCount);

    for (const friend of selectedFriends) {
      const key = [person.id, friend.id].sort().join('-');
      if (friendshipMap.has(key)) continue;

      friendshipMap.add(key);

      friendships.push(
        friendRepo.create({ personId: person.id, friendId: friend.id }),
        friendRepo.create({ personId: friend.id, friendId: person.id }),
      );
    }
  }

  const inserted = await friendRepo.save(friendships);
  console.log(`Seeded ${inserted.length} friend links (2 rows per friendship)`);

  return inserted;
}
