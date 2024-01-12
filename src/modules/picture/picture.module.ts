import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@/common/common.module';

import { CarModule } from '../car/car.module';
import { PictureMapper } from './application/mapper/picture.mapper';
import { PICTURE_REPOSITORY } from './application/repository/picture.interface.repository';
import { PictureService } from './application/service/picture.service';
import { PictureRepository } from './infrastructure/persistence/picture.repository';
import { PictureSchema } from './infrastructure/persistence/picture.schema';
import { PictureController } from './interface/picture.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureSchema]),
    forwardRef(() => CarModule),
    CommonModule,
    CarModule,
  ],

  controllers: [PictureController],

  providers: [
    PictureService,
    PictureMapper,
    {
      provide: PICTURE_REPOSITORY,
      useClass: PictureRepository,
    },
  ],
})
export class PictureModule {}
