import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) { }

  @Post()
  async create(@Body() event: CreateEventDto) {
    return await this.eventService.create(event);
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event | null> {
    const event = await this.eventService.findOne(id);
    if (null === event) {
      throw new HttpException(`event not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
    return event;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() event: CreateEventDto) {
    const existingEvent = await this.findOne(id);
    if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }

    return await this.eventService.update(id, event);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existingEvent = await this.findOne(id);
    if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }

    return await this.eventService.remove(id);
  }


}
