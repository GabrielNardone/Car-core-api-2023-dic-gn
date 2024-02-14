export const FILE_UPLOAD_SERVICE = 'FILE_UPLOAD_SERVICE';

export interface IFileUploadService {
  uploadFiles(file: Buffer): Promise<string>;
}
