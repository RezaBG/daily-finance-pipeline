import {
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProcessService } from './process.service';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook() {
    return this.processService.handleWebhook();
  }

  @Post(':processId')
  @HttpCode(204)
  async run(@Param('processId', ParseIntPipe) processId: number) {
    await this.processService.runProcessesUpTo(processId);
  }
}
