import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Rent } from '../../domain/rent.domain';

export const RentSchema = new EntitySchema<Rent>({
  name: 'Rent',
  target: Rent,
  columns: {
    ...baseColumnSchemas,
    acceptedDate: {
      name: 'accepted_date',
      type: 'date',
    },
    pricePerDay: {
      name: 'price_per_day',
      type: 'int',
    },
    startingDate: {
      name: 'starting_date',
      type: 'date',
    },
    dueDate: {
      name: 'due_date',
      type: 'date',
    },
    endDate: {
      name: 'end_date',
      type: 'date',
    },
    rejected: {
      type: 'boolean',
    },
  },
  relations: {
    car: {
      target: 'Car',
      type: 'many-to-one',
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
      type: 'many-to-one',
      joinColumn: {
        name: 'fk_admin_id',
      },
      nullable: false,
    },
  },
});
