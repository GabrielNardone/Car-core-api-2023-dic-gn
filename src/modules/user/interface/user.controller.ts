import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
} from '@nestjs/common';

import { UpdateUserDto } from '../application/dto/update-user.dto';
import { RequestWithUser } from '../application/repository/request-with-user-interface';
import { UserService } from '../application/service/user.service';
import { User } from '../domain/user.domain';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Get('me')
  async findMe(@Req() request: RequestWithUser): Promise<User> {
    return request.user;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.userService.remove(id);
  }
}
