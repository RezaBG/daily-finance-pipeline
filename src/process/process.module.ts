import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessRun } from './entities/process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessRun])],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}
