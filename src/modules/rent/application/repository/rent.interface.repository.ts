import { Rent } from '../../domain/rent.domain';

export const RENT_REPOSITORY = 'RENT_REPOSITORY';

export interface IRentRepository {
  create(rent: Rent): Promise<Rent>;
  findAll(): Promise<Rent[]>;
  findById(id: number): Promise<Rent>;
  update(id: number, rent: Rent): Promise<Rent>;
  delete(id: number): Promise<boolean>;
}
