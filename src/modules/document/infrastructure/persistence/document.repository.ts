import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IDocumentRepository } from '../../application/repository/document.repository.interface';
import { Document } from '../../domain/document.domain';
import { DocumentSchema } from './document.schema';

@Injectable()
export class DocumentRepository implements IDocumentRepository {
  constructor(
    @InjectRepository(DocumentSchema)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(document: Document): Promise<Document> {
    return await this.documentRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find({ relations: { user: true } });
  }

  async findById(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return document;
  }

  async update(id: number, document: Document): Promise<Document> {
    const updatedDocument = await this.documentRepository.preload({
      id,
      ...document,
    });

    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return updatedDocument;
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.documentRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return true;
  }
}
