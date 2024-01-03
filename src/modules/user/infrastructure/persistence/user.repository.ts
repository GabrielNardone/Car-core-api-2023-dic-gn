import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import {
  badRequestError,
  notFoundError,
} from '../../application/exceptions/user.error';
import { IUserRepository } from '../../application/repository/user.interface.repository';
import { User } from '../../domain/user.domain';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);

      if (error.code === '23505') {
        badRequestError(error.detail);
      }

      throw new InternalServerErrorException(
        'Can´t create user, check server logs',
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) notFoundError(id);
      return user;
    } catch (error) {
      console.log(error);

      if (error.status === 404) {
        notFoundError(id);
      }

      throw new InternalServerErrorException(
        'Can´t create user, check server logs',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
      });

      if (!user) notFoundError(id);

      return this.userRepository.save(user);
    } catch (error) {
      console.log(error);

      if (error.status === 404) {
        notFoundError(id);
      }
    }
  }

  async delete(id: number): Promise<true> {
    const user = await this.findById(id);

    await this.userRepository.remove(user);

    return true;
  }
}
