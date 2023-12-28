import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

import { Book } from '../../domain/book.domain';
import { Format } from '../../domain/format.enum';

export const BookSchema = new EntitySchema<Book>({
  name: 'Book',
  target: Book,
  columns: {
    ...baseColumnSchemas,
    title: {
      name: 'title',
      type: 'varchar',
    },
    format: {
      name: 'format',
      type: 'simple-enum',
      enum: Format,
      default: Format.DIGITAL,
    },
  },
  relations: {
    author: {
      target: 'Author',
      type: 'many-to-one',
      joinColumn: {
        name: 'fk_author_id',
      },
      inverseSide: 'books',
      nullable: false,
    },
  },
});
