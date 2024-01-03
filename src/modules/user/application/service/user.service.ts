import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../domain/user.domain';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repository/user.interface.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<true> {
    return await this.userRepository.delete(id);
  }
}
