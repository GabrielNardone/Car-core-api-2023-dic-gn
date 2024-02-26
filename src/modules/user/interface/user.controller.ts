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

import { RoleProtected } from '@/modules/auth/interface/decorator/roles.decorator';

import { UpdateUserDto } from '../application/dto/update-user.dto';
import { RequestWithUser } from '../application/repository/request-with-user-interface';
import { UserService } from '../application/service/user.service';
import { Role } from '../domain/format.enum';
import { User } from '../domain/user.domain';

@Controller('user')
@RoleProtected(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('me')
  @RoleProtected(Role.CLIENT)
  findMe(@Req() request: RequestWithUser): User {
    return request.user;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findOneByEmail(email);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return await this.userService.remove(id);
  }
}
