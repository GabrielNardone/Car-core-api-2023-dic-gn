import { User } from '../../domain/user.domain';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findByExternalId(externalId: string): Promise<User>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<boolean>;
}
