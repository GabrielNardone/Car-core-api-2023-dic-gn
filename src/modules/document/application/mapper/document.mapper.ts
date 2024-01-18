import { Injectable } from '@nestjs/common';

import { Document } from '../../domain/document.domain';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentMapper {
  fromDtoToEntity(document: CreateDocumentDto | UpdateDocumentDto) {
    const newDocument = new Document();
    newDocument.description = document.description;
    newDocument.src = document.src;
    newDocument.title = document.title;
    newDocument.url = document.url;

    return newDocument;
  }
}
