import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/user.domain';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../mapper/user.mapper';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repository/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(UserMapper)
    private readonly userMapper: UserMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userMapper.fromDtoToEntity(createUserDto);

    return await this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.userMapper.fromDtoToEntity(updateUserDto);

    return await this.userRepository.update(id, user);
  }

  async remove(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
