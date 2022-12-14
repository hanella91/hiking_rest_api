import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';

export class UserNameAlreadyExistError extends Error {
}

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ username: user.username });
    if (existingUser) {
      throw new UserNameAlreadyExistError();
    }
    return await this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }

  async update(id: string, user: User): Promise<void> {
    await
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        })
        .where("id = :id", { id })
        .execute()
  }
}