import { Module } from '@nestjs/common';

import { FILE_UPLOAD_REPOSITORY } from './application/repository/file-upload.repository.interface';
import { S3Service } from './infrastructure/s3/s3.service';

@Module({
  providers: [
    {
      provide: FILE_UPLOAD_REPOSITORY,
      useClass: S3Service,
    },
  ],
  exports: [FILE_UPLOAD_REPOSITORY],
})
export class CommonModule {}
