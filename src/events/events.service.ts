import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Reservation } from '../reservations/entity/reservation.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entity/event.entity';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) { }

  async create(userId: string, event: CreateEventDto): Promise<Event> {
    if (event.maxReservation <= 1) {
      throw new HttpException(`maxReservation should be more than 1`, HttpStatus.BAD_REQUEST);
    }

    return await this.eventRepository.save({
      ...event,
      userId,
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event | null> {
    return await this.eventRepository.findOneBy({ id });
  }

  async update(userId: string, id: string, updateEvent: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepository.findOneBy({ id });
    if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }

    if (existingEvent.userId !== userId) {
      throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
    }

    return await this.eventRepository.save({
      ...existingEvent,
      ...updateEvent,
      id
    });
  }

  async remove(userId: string, id: string): Promise<DeleteResult> {
    const existingEvent = await this.eventRepository.findOneBy({ id });
    if (null === existingEvent) {
      throw new HttpException(`event not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }
    if (existingEvent.userId !== userId) {
      throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
    }


    return await this.eventRepository.delete(id);
  }
}
