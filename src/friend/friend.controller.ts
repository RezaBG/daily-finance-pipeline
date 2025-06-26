import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateFriendDto): Promise<void> {
    await this.friendService.create(dto);
  }

  @Get()
  async findAll() {
    return this.friendService.findAll();
  }
}
