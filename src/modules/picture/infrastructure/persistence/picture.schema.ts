import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { CarPicture } from '../../domain/car-picture.enum';
import { Picture } from '../../domain/picture.domain';

export const PictureSchema = new EntitySchema<Picture>({
  name: 'Picture',
  target: Picture,
  columns: {
    ...baseColumnSchemas,
    src: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
    title: {
      type: 'varchar',
    },
    type: {
      type: 'simple-enum',
      enum: CarPicture,
      default: CarPicture.FRONT,
    },
    date: {
      type: 'date',
    },
  },
  relations: {
    car: {
      target: 'Car',
      type: 'many-to-one',
      joinColumn: {
        name: 'fk_car_id',
      },
      inverseSide: 'images',
      onDelete: 'CASCADE',
    },
  },
});
