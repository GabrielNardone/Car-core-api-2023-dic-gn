import { Car } from '../../domain/car.domain';

export const CAR_REPOSITORY = 'CAR_REPOSITORY';

export interface ICarRepository {
  create(car: Car): Promise<Car>;
  findAll(): Promise<Car[]>;
  findById(id: number): Promise<Car>;
  update(id: number, newCar: Car): Promise<Car>;
  delete(id: number): Promise<boolean>;
}
