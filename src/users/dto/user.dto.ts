import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entity/users.entity';

export class CreateUserDto extends OmitType(User, ['id', 'createdAt',]) { }