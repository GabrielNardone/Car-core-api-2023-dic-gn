import { Injectable } from '@nestjs/common';

import { User } from '../../domain/user.domain';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser } from '../service/user.service';

@Injectable()
export class UserMapper {
  public toEntity(source: IUser | UpdateUserDto) {
    const newUser = new User();
    newUser.firstName = source.firstName;
    newUser.lastName = source.lastName;
    newUser.dob = source.dob;
    newUser.email = source.email;
    newUser.address = source.address;
    newUser.country = source.country;
    newUser.externalId = source.externalId;
    newUser.role = source?.role;

    return newUser;
  }
}
