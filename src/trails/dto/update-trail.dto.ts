import { PartialType } from '@nestjs/mapped-types';
import { CreateTrailDto } from './create-trail.dto';

export class UpdateTrailDto extends PartialType(CreateTrailDto) { }