import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Car } from '../../domain/car.domain';

export const CarSchema = new EntitySchema<Car>({
  name: 'Car',
  target: Car,
  columns: {
    ...baseColumnSchemas,
    brand: {
      type: 'varchar',
    },
    model: {
      type: 'varchar',
    },
    color: {
      type: 'varchar',
    },
    passengers: {
      type: 'int',
    },
    ac: {
      type: 'boolean',
    },
    pricePerDay: {
      type: 'int',
    },
  },
  relations: {
    images: {
      target: 'Picture',
      type: 'one-to-many',
      inverseSide: 'car',
    },
  },
});
