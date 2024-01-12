import { Module } from '@nestjs/common';

import { FILE_UPLOAD_SERVICE } from './application/repository/file-upload.interface.repository';
import { S3Service } from './infrastructure/s3/s3.service';

@Module({
  providers: [
    {
      provide: FILE_UPLOAD_SERVICE,
      useClass: S3Service,
    },
  ],
  exports: [FILE_UPLOAD_SERVICE],
})
export class CommonModule {}
