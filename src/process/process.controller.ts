import { Controller } from '@nestjs/common';
import { ProcessService } from './process.service';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}
}
