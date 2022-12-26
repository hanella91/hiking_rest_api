import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entity/users.entity';
import { UserInfoWithoutPassword, UserInfoWithoutEmail, UserNameAlreadyExistError, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }
  /**
   * Return new created user.
   *
   * @param user New user info for creating
   * @returns UserInfo
   */

  @Public()
  @Post()
  async create(@Body() user: CreateUserDto): Promise<UserInfoWithoutPassword> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      if (error instanceof UserNameAlreadyExistError) {
        throw new HttpException(`user with username '${user.username}' already exists.`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  /**
   * Return an user for a given id.
   *
   * @param id The user id of the requested user.
   * @param userId The user id from the jwt.
   * @returns UserInfo | UserInfoWithoutEmail
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any): Promise<UserInfoWithoutPassword | UserInfoWithoutEmail> {
    const user = await this.userService.findOneById(id);
    if (null === user) {
      throw new HttpException(`user not found for id: ${id}.`, HttpStatus.NOT_FOUND);
    }
    const { email, password, ...userInfo } = user;
    if (id === req.user.userId) {
      return {
        ...userInfo,
        email
      };
    }

    return userInfo;
  }

  /**
 * Update an user for a given id.
 *
 * @param id The user id of the requested user.
 * @param userId The user id from the jwt.
 * @returns UserInfo | UserInfoWithoutEmail
 * ERROR : If someone not own the user account try to update, 403Error
 */

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() updateUserDto: UpdateUserDto): Promise<UserInfoWithoutPassword | undefined> {
    return await this.userService.update(req.user.userId, id, updateUserDto);
  }
}
