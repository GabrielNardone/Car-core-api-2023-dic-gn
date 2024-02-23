export const FILE_UPLOAD_REPOSITORY = 'FILE_UPLOAD_REPOSITORY';

export interface IFileUploadRepository {
  uploadFiles(file: Buffer): Promise<string>;
}
