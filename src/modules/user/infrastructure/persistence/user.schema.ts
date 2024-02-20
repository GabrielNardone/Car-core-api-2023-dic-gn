import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Role } from '../../domain/format.enum';
import { User } from '../../domain/user.domain';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    ...baseColumnSchemas,
    firstName: {
      name: 'first_name',
      type: 'varchar',
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
    },
    dob: {
      type: 'date',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    address: {
      type: 'varchar',
    },
    country: {
      type: 'varchar',
    },
    role: {
      type: 'simple-enum',
      enum: Role,
      default: Role.CLIENT,
    },
    externalId: {
      name: 'external_id',
      type: 'varchar',
    },
  },
  relations: {
    document: {
      target: 'Document',
      type: 'one-to-many',
      inverseSide: 'user',
    },
  },
});
