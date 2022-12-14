import { OmitType } from '@nestjs/mapped-types';
import { Trail } from '../entity/trail.entity';

export class CreateTrailDto extends OmitType(Trail, ['id', 'userId', 'createdAt', 'updatedAt']) { }