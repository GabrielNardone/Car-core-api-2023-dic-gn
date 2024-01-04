import { Injectable } from '@nestjs/common';

import { User } from '../../domain/user.domain';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserMapper {
  public fromDtoToEntity(userDto: CreateUserDto | UpdateUserDto) {
    const newUser = new User();
    newUser.firstName = userDto.firstName;
    newUser.lastName = userDto.lastName;
    newUser.dob = userDto.dob;
    newUser.email = userDto.email;
    newUser.address = userDto.address;
    newUser.country = userDto.country;

    return newUser;
  }
}
