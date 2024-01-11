import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Rent } from '../../domain/rent.domain';

export const RentSchema = new EntitySchema<Rent>({
  name: 'Rent',
  target: Rent,
  columns: {
    ...baseColumnSchemas,
    acceptedDate: {
      type: 'date',
    },
    pricePerDay: {
      type: 'int',
    },
    startingDate: {
      type: 'date',
    },
    dueDate: {
      type: 'date',
    },
    endDate: {
      type: 'date',
    },
    rejected: {
      type: 'boolean',
    },
  },
  relations: {
    car: {
      target: 'Car',
      type: 'one-to-one',
      joinColumn: {
        name: 'fk_car_id',
      },
      nullable: false,
    },
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'fk_user_id',
      },
      nullable: false,
    },
    admin: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: {
        name: 'fk_admin_id',
      },
      nullable: false,
    },
  },
});
