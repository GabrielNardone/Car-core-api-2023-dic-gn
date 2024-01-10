import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreatePictureDto } from '../application/dto/create-picture.dto';
import { UpdatePictureDto } from '../application/dto/update-picture.dto';
import { PictureService } from '../application/service/picture.service';
import { Picture } from '../domain/picture.domain';

@Controller('picture')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post('car/:id')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Param('id') id: number,

    @Body() createPictureDto: CreatePictureDto,

    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp(/\.(jpg|jpeg|png)$/i),
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<Picture> {
    return this.pictureService.create(createPictureDto, files[0].buffer, id);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Picture> {
    return this.pictureService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.pictureService.remove(id);
  }
}
