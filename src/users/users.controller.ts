import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { User } from './entity/users.entity';
import { UserNameAlreadyExistError, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Post()
  async create(@Body() user: User) {
    try {
      return await this.userService.create(user)
    } catch (error) {
      if (error instanceof UserNameAlreadyExistError) {
        throw new HttpException(`user with username '${user.username}' already exists.`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (null === user) {
      throw new HttpException(`user not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() user: User) {
    const existingUser = this.findOne(id);
    if (existingUser) {
      this.userService.update(id, user);
    } else if (null === user) {
      throw new HttpException(`user not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
  }
}
