import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsDate, IsIn, IsInt, IsString } from 'class-validator';
import { Event } from '../entity/event.entity'

export class CreateEventDto extends OmitType(
  Event, [
    'id',
    'userId',
    'createdAt',
    'updatedAt'
  ] as const) { }
