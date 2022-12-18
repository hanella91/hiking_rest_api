import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayload } from './strategies/jwt.strategy';

type AccessToken = {
  access_token: string
}

type UserWithoutPassword = Omit<User, 'password'>

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<UserWithoutPassword | null> {
    const user = await this.userService.findOneByUsername(username);
    const result = await bcrypt.compare(pass, user.password)
    if (result) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User): AccessToken {
    const payload: AccessTokenPayload = { userName: user.username, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
