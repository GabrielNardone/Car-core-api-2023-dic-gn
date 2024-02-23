import { Inject, Injectable } from '@nestjs/common';

import { Role } from '../../domain/format.enum';
import { User } from '../../domain/user.domain';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../mapper/user.mapper';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repository/user.repository.interface';

export interface IUser {
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  address: string;
  country: string;
  externalId: string;
  role?: Role;
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(UserMapper)
    private readonly userMapper: UserMapper,
  ) {}

  async create(iUser: IUser): Promise<User> {
    const user = this.userMapper.toEntity(iUser);

    return await this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async findOneByExternalId(externalId: string): Promise<User> {
    return await this.userRepository.findByExternalId(externalId);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.userMapper.toEntity(updateUserDto);

    return await this.userRepository.update(id, user);
  }

  async remove(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
