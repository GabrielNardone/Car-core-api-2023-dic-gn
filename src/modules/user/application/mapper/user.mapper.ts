import { Injectable } from '@nestjs/common';

import { User } from '../../domain/user.domain';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser } from '../service/user.service';

@Injectable()
export class UserMapper {
  public fromInterfaceToEntity(iUser: IUser | UpdateUserDto) {
    const newUser = new User();
    newUser.firstName = iUser.firstName;
    newUser.lastName = iUser.lastName;
    newUser.dob = iUser.dob;
    newUser.email = iUser.email;
    newUser.address = iUser.address;
    newUser.country = iUser.country;
    newUser.externalId = iUser.externalId;
    newUser.role = iUser?.role;

    return newUser;
  }
}
