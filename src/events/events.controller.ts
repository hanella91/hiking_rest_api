import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Redirect, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() event: CreateEventDto) {
    event.userId = req.user.userId;
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
  @UseGuards(JwtAuthGuard)
  async update(@Request() req: any, @Param('id') id: string, @Body() event: CreateEventDto) {
    const existingEvent = await this.eventService.findOne(id);
    if (existingEvent) {
      if (existingEvent.userId === req.user.userId) {
        return await this.eventService.update(id, event);
      } else {
        throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
      }
    } else if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    const existingEvent = await this.findOne(id);
    if (existingEvent) {
      if (existingEvent.userId === req.user.userId) {
        return await this.eventService.remove(id);
      } else {
        throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
      }
    } else if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }
  }
}
