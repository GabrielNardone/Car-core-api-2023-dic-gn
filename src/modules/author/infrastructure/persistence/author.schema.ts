import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Author } from '../../domain/author.domain';
import { Status } from '../../domain/status.enum';

export const AuthorSchema = new EntitySchema<Author>({
  name: 'Author',
  target: Author,
  columns: {
    ...baseColumnSchemas,
    firstName: {
      name: 'firstName',
      type: 'varchar',
    },
    lastName: {
      name: 'lastName',
      type: 'varchar',
    },
    password: {
      name: 'password',
      type: 'varchar',
    },
    status: {
      name: 'status',
      type: 'simple-enum',
      enum: Status,
      default: Status.ACTIVE,
    },
  },
  relations: {
    books: {
      target: 'Book',
      type: 'one-to-many',
      joinColumn: {
        name: 'fk_author_id',
      },
      inverseSide: 'author',
    },
  },
});
