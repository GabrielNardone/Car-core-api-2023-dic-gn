import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RoleProtected } from '@/modules/auth/interface/decorator/roles.decorator';
import { Role } from '@/modules/user/domain/format.enum';

import { CreatePictureDto } from '../application/dto/create-picture.dto';
import { PictureService } from '../application/service/picture.service';
import { Picture } from '../domain/picture.domain';

@Controller('picture')
@RoleProtected(Role.ADMIN)
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post('car/:id')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('id') id: number,

    @Body() createPictureDto: CreatePictureDto,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 3145728,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Picture> {
    return this.pictureService.create(createPictureDto, file.buffer, id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.pictureService.remove(id);
  }
}
