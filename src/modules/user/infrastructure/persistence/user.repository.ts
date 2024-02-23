import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository } from '../../application/repository/user.repository.interface';
import { User } from '../../domain/user.domain';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: { document: true } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { document: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    return null;
  }

  async findByExternalId(externalId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { externalId } });

    if (!user) {
      throw new NotFoundException(
        `User with externalId ${externalId} not found`,
      );
    }

    return user;
  }

  async update(id: number, user: User): Promise<User> {
    const updatedUser = await this.userRepository.preload({
      id,
      ...user,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.userRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return true;
  }
}
