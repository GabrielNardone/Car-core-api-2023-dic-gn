import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICarRepository } from '../../application/repository/car.interface.repository';
import { Car } from '../../domain/car.domain';
import { CarSchema } from './car.schema';

@Injectable()
export class CarRepository implements ICarRepository {
  constructor(
    @InjectRepository(CarSchema)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(car: Car): Promise<Car> {
    return await this.carRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return await this.carRepository.find();
  }

  async findById(id: number): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });

    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return car;
  }

  async update(id: number, newCar: Car): Promise<Car> {
    const updatedCar = await this.carRepository.preload({
      id,
      ...newCar,
    });

    if (!updatedCar) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return updatedCar;
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.carRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return true;
  }
}
