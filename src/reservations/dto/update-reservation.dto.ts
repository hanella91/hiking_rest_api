import { PickType } from '@nestjs/mapped-types';
import { IsIn, IsString } from 'class-validator';
import { Reservation } from '../entity/reservation.entity';

export class ReservationDto extends PickType(Reservation, ['status'] as const) { }