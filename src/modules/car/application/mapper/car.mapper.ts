import { Injectable } from '@nestjs/common';

import { Car } from '../../domain/car.domain';
import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';

@Injectable()
export class CarMapper {
  public fromDtoToEntity(carDto: CreateCarDto | UpdateCarDto) {
    const newCar = new Car();
    newCar.brand = carDto.brand;
    newCar.model = carDto.model;
    newCar.color = carDto.color;
    newCar.passengers = carDto.passengers;
    newCar.ac = carDto.ac;
    newCar.pricePerDay = carDto.pricePerDay;

    return newCar;
  }
}
