import { ConsoleLogger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserNameAlreadyExistError extends Error { }

export type UserInfoWithoutPassword = Omit<User, 'password'>
export type UserInfoWithoutEmail = Omit<UserInfoWithoutPassword, 'email'>

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(newUser: CreateUserDto): Promise<UserInfoWithoutPassword | undefined> {
    const existingUser = await this.userRepository.findOneBy({ username: newUser.username });
    if (existingUser) {
      throw new UserNameAlreadyExistError();
    }

    const hashedPassword = await this.transformPassword(newUser.password);
    const createdUser = await this.userRepository.save({ ...newUser, password: hashedPassword, createdAt: new Date() });
    const { password, ...createdUserWithoutPassword } = createdUser;
    return createdUserWithoutPassword;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(jwtUserId: string, id: string, updateUserDto: UpdateUserDto): Promise<UserInfoWithoutPassword | undefined> {
    const existingUser = await this.userRepository.findOneBy({ id });

    if (existingUser && existingUser.id !== jwtUserId) {
      throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
    }

    let  userPassword = existingUser.password
    if (updateUserDto.password) {
      userPassword = await this.transformPassword(updateUserDto.password);
    }

    const updatedUser = await
      this.userRepository.save({
        ...existingUser,
        ...updateUserDto,
        id,
        password : userPassword,
      });

    const { password, ...updatedUserWithoutPassword } = updatedUser;
    return updatedUserWithoutPassword;


  }

  private async transformPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password, 10
    );
  }
}