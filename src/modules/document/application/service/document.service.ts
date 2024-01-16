import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@/modules/user/application/repository/user.interface.repository';

import { Document } from '../../domain/document.domain';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { DocumentMapper } from '../mapper/document.mapper';
import {
  DOCUMENT_REPOSITORY,
  IDocumentRepository,
} from '../repository/document.interface.repository';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(DocumentMapper)
    private readonly documentMapper: DocumentMapper,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const user = await this.userRepository.findById(createDocumentDto.user);
    if (!user) {
      throw new NotFoundException(
        `User with id ${createDocumentDto} not found`,
      );
    }

    const document = this.documentMapper.fromDtoToEntity(createDocumentDto);
    document.user = user;

    return await this.documentRepository.create(document);
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.findAll();
  }

  async findOne(id: number): Promise<Document> {
    return await this.documentRepository.findById(id);
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = this.documentMapper.fromDtoToEntity(updateDocumentDto);

    return this.documentRepository.update(id, document);
  }

  async remove(id: number): Promise<boolean> {
    return this.documentRepository.delete(id);
  }
}
