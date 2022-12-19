import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Redirect, Request, UseGuards } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entity/event.entity';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) { }

  @Post()
  async create(@Request() req: any, @Body() event: CreateEventDto): Promise<Event> {
    return await this.eventService.create(req.user.userId, event);
  }

  @Public()
  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event | null> {
    const event = await this.eventService.findOne(id);
    if (null === event) {
      throw new HttpException(`event not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
    return event;
  }

  @Patch(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() event: UpdateEventDto): Promise<Event> {
    return await this.eventService.update(req.user.userId, id, event);
  }

  @Public()
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string): Promise<DeleteResult> {
    return await this.eventService.remove(req.user.userId, id);
  }
};
