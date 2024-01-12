import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarMapper } from './application/mapper/car.mapper';
import { CAR_REPOSITORY } from './application/repository/car.interface.repository';
import { CarService } from './application/services/car.service';
import { CarRepository } from './infrastructure/persistence/car.repository';
import { CarSchema } from './infrastructure/persistence/car.schema';
import { CarController } from './interface/car.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarSchema])],

  controllers: [CarController],

  providers: [
    CarService,
    CarMapper,
    {
      provide: CAR_REPOSITORY,
      useClass: CarRepository,
    },
  ],

  exports: [CAR_REPOSITORY],
})
export class CarModule {}
