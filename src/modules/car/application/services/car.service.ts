import { Inject, Injectable } from '@nestjs/common';

import { Car } from '../../domain/car.domain';
import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';
import { CarMapper } from '../mapper/car.mapper';
import {
  CAR_REPOSITORY,
  ICarRepository,
} from '../repository/car.repository.interface';

@Injectable()
export class CarService {
  constructor(
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: ICarRepository,
    @Inject(CarMapper)
    private readonly carMapper: CarMapper,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carMapper.fromDtoToEntity(createCarDto);

    return await this.carRepository.create(car);
  }

  async findAll(): Promise<Car[]> {
    return await this.carRepository.findAll();
  }

  async findOne(id: number): Promise<Car> {
    return await this.carRepository.findById(id);
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = this.carMapper.fromDtoToEntity(updateCarDto);

    return await this.carRepository.update(id, car);
  }

  async remove(id: number): Promise<boolean> {
    return await this.carRepository.delete(id);
  }
}
