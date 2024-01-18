import { Document } from '../../domain/document.domain';

export const DOCUMENT_REPOSITORY = 'DOCUMENT_REPOSITORY';

export interface IDocumentRepository {
  create(document: Document): Promise<Document>;
  findAll(): Promise<Document[]>;
  findById(id: number): Promise<Document>;
  update(id: number, document: Document): Promise<Document>;
  delete(id: number): Promise<boolean>;
}
