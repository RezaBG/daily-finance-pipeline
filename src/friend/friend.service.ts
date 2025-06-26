import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
  ) {}

  async create(dto: CreateFriendDto): Promise<void> {
    const { personId, friendId } = dto;

    if (personId === friendId) {
      throw new BadRequestException('Cannot add self as friend.');
    }

    // Check if the friendship already exists
    const exists = await this.friendRepo.findOneBy([
      { personId, friendId },
      { personId: friendId, friendId: personId }, // bidirectional check
    ]);

    if (exists) {
      throw new BadRequestException('Friendship already exists.');
    }

    // Create both directions
    const aToB = this.friendRepo.create({ personId, friendId });
    const bToA = this.friendRepo.create({
      personId: friendId,
      friendId: personId,
    });

    await this.friendRepo.save([aToB, bToA]);
  }

  async findAll(): Promise<Friend[]> {
    return this.friendRepo.find();
  }
}
