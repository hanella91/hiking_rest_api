import { OmitType } from '@nestjs/mapped-types';
import { Event } from '../entity/event.entity'

export class CreateEventDto extends OmitType(
  Event, [
    'id',
    'createdAt',
    'updatedAt'
  ] as const) { }
