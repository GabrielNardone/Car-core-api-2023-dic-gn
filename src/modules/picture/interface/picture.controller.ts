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

import { CreatePictureDto } from '../application/dto/create-picture.dto';
import { UpdatePictureDto } from '../application/dto/update-picture.dto';
import { PictureService } from '../application/service/picture.service';
import { Picture } from '../domain/picture.domain';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post()
  create(@Body() createPictureDto: CreatePictureDto): Promise<Picture> {
    return this.pictureService.create(createPictureDto);
  }

  @Get()
  findAll(): Promise<Picture[]> {
    return this.pictureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Picture> {
    return this.pictureService.findOne(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePictureDto: UpdatePictureDto,
  ): Promise<Picture> {
    return this.pictureService.update(id, updatePictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.pictureService.remove(id);
  }
}
