import { IsString } from 'class-validator';
import { User } from 'src/users/entity/users.entity';

export class LoginDto {

  user: User;

  @IsString()
  username: string;

  @IsString()
  password: string;
}