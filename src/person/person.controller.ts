import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/person-create.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }
  @Get()
  findAll() {
    return this.personService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }
  // TODO: implement soft delete
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }
}
