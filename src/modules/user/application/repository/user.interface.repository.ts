import { User } from '../../domain/user.domain';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(user: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  update(id: number, newUser: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<true>;
}
