import { OmitType } from '@nestjs/mapped-types';
import { Reservation } from '../entity/reservation.entity'

export class CreateReservationDto extends OmitType(
  Reservation, [
    'id',
    'userId',
    'eventId',
    'createdAt',
    'updatedAt'
  ] as const) { }
