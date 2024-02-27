import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { RoleProtected } from '@/modules/auth/application/decorator/roles.decorator';
import { Role } from '@/modules/user/domain/format.enum';

import { CreateDocumentDto } from '../application/dto/create-document.dto';
import { UpdateDocumentDto } from '../application/dto/update-document.dto';
import { DocumentService } from '../application/service/document.service';
import { Document } from '../domain/document.domain';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentService.create(createDocumentDto);
  }

  @Get()
  @RoleProtected(Role.ADMIN)
  findAll(): Promise<Document[]> {
    return this.documentService.findAll();
  }

  @Get(':id')
  @RoleProtected(Role.ADMIN)
  findOne(@Param('id') id: number): Promise<Document> {
    return this.documentService.findOne(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.documentService.remove(id);
  }
}
