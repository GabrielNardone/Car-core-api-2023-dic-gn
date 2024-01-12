import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

import { IFileUploadService } from '@/common/application/repository/file-upload.interface.repository';

export class S3Service implements IFileUploadService {
  constructor(
    private readonly s3 = new S3Client({ region: process.env.AWS_S3_REGION }),
  ) {}

  async uploadFiles(file: Buffer): Promise<string> {
    const fileKey = uuid();

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file,
      }),
    );

    const filePath = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;

    return filePath;
  }
}
