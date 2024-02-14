import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

import { CommonErrors } from '@/common/application/exceptions/common.errors';
import { IFileUploadService } from '@/common/application/repository/file-upload.repository.interface';

@Injectable()
export class S3Service implements IFileUploadService {
  private readonly client: S3Client;
  private readonly bucket = this.configService.get('s3.bucket');
  private readonly region = this.configService.get('s3.region');
  private readonly accessKey = this.configService.get('s3.accesskey');
  private readonly secretKey = this.configService.get('s3.secretKey');
  private readonly endpoint = this.configService.get('s3.endpoint');

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
      endpoint: this.endpoint,
      forcePathStyle: true,
    });
  }

  async uploadFiles(file: Buffer): Promise<string> {
    const fileKey = uuid();

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
          Body: file,
        }),
      );

      const filePath = `${this.endpoint}/${this.bucket}/${fileKey}`;

      return filePath;
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      throw new Error(CommonErrors.UPLOADING_ERROR);
    }
  }
}
