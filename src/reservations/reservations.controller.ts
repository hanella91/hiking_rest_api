import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entity/reservation.entity';
import { ReservationsService } from './reservations.service';

@Controller('events/:id/reservations')
export class ReservationsController {
  constructor(private reservationService: ReservationsService) { }

  @Post()
  async create(@Param('id') eventId: string) {
    return await this.reservationService.create(eventId);
  }

  @Get()
  async findAll(@Param('id') eventId: string): Promise<Reservation[]> {
    return await this.reservationService.findAll(eventId);
  }

  @Get(':reservation_id')
  async findOne(@Param('reservation_id') id: string): Promise<Reservation | null> {
    const reservation = await this.reservationService.findOne(id);
    if (null === reservation) {
      throw new HttpException(`reservation not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
    return reservation;
  }

  @Patch(':reservation_id')
  async update(@Param('reservation_id') id: string, @Body() reservation: ReservationDto): Promise<Reservation> {
    const existingReservation = await this.findOne(id);
    if (null === existingReservation) {
      throw new HttpException(`reservation not found for id : ${id}`, HttpStatus.BAD_REQUEST);
    }

    await this.reservationService.update(id, reservation);
    return
  }
}

