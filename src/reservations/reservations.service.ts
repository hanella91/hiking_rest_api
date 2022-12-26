import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entity/reservation.entity';
import { EventsService } from '../events/events.service';


@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private eventsService: EventsService,

  ) { }

  async create(requestUser: string, eventId: string): Promise<Reservation | null> {
    const condition = { eventId: eventId }
    const event = await this.eventsService.findOne(eventId);
    const memberCount = (await this.reservationRepository.findBy(condition)).length;
    console.log(event);

    if (memberCount >= event.maxReservation) {
      throw new HttpException(`This Event has been full(${memberCount}/${event.maxReservation})`, HttpStatus.FORBIDDEN);
    }

    return await this.reservationRepository.save({
      eventId,
      userId: requestUser
    });
  }

  async findAll(eventId: string): Promise<Reservation[]> {
    return await this.reservationRepository.findBy({ eventId });
  }

  async findOne(id: string): Promise<Reservation> {
    return await this.reservationRepository.findOneBy({ id });
  }

  async update(id: string, reservation: UpdateReservationDto): Promise<Reservation> {
    return await this.reservationRepository.save({ ...reservation, id })
  }

  async removeByEventId(id: string): Promise<DeleteResult> {
    return await this.reservationRepository.delete({ eventId: id });
  }

}