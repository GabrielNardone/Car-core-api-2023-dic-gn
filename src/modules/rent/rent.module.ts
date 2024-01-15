import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModule } from '../car/car.module';
import { UserModule } from '../user/user.module';
import { RentMapper } from './application/mapper/rent.mapper';
import { RENT_REPOSITORY } from './application/repository/rent.interface.repository';
import { RentService } from './application/service/rent.service';
import { RentRepository } from './infrastructure/persistence/rent.repository';
import { RentSchema } from './infrastructure/persistence/rent.schema';
import { RentController } from './interface/rent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RentSchema]), CarModule, UserModule],

  controllers: [RentController],

  providers: [
    RentService,
    RentMapper,
    {
      provide: RENT_REPOSITORY,
      useClass: RentRepository,
    },
  ],
})
export class RentModule {}
