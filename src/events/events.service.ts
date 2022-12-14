import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import * as uuid from 'uuid';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) { }

  async create(event: CreateEventDto): Promise<void> {
    await this.eventRepository.save({
      ...event,
      trailId: '1',
      userId: uuid.v4(),
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event | null> {
    return await this.eventRepository.findOneBy({ id });
  }

  async update(id: string, event: CreateEventDto): Promise<void> {
    await
      this.eventRepository
        .createQueryBuilder()
        .update(Event)
        .set({
          maxPersons: event.maxPersons,
          date: event.date,
          description: event.description,
          reservationType: event.reservationType,
          updatedAt: new Date(),
          reservationUntill: event.reservationUntill,
        })
        .where("id = :id", { id })
        .execute();
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
