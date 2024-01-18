import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '../../../../common/infrastructure/persistence/base.schema';
import { Document } from '../../domain/document.domain';

export const DocumentSchema = new EntitySchema<Document>({
  name: 'Document',
  target: Document,
  columns: {
    ...baseColumnSchemas,
    url: {
      type: 'varchar',
    },
    src: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
    title: {
      type: 'varchar',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'fk_user_id',
      },
      nullable: false,
      inverseSide: 'document',
      onDelete: 'CASCADE',
    },
  },
});
