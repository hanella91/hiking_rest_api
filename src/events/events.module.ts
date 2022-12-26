import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservations/entity/reservation.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { Event } from './entity/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Reservation])],
  controllers: [EventsController],
  providers: [EventsService, ReservationsService],
  exports: [TypeOrmModule]
})

export class EventsModule { }
