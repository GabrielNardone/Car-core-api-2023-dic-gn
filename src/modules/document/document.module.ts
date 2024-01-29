import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { DocumentMapper } from './application/mapper/document.mapper';
import { DOCUMENT_REPOSITORY } from './application/repository/document.repository.interface';
import { DocumentService } from './application/service/document.service';
import { DocumentRepository } from './infrastructure/persistence/document.repository';
import { DocumentSchema } from './infrastructure/persistence/document.schema';
import { DocumentController } from './interface/document.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentSchema]),
    forwardRef(() => UserModule),
  ],

  controllers: [DocumentController],

  providers: [
    DocumentService,
    DocumentMapper,
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: DocumentRepository,
    },
  ],

  exports: [DOCUMENT_REPOSITORY],
})
export class DocumentModule {}
