import { Injectable } from '@nestjs/common';

import { Picture } from '../../domain/picture.domain';
import { CreatePictureDto } from '../dto/create-picture.dto';

@Injectable()
export class PictureMapper {
  public fromDtoToEntity(pictureDto: CreatePictureDto, filePath: string) {
    const newPicture = new Picture();
    newPicture.title = pictureDto.title;
    newPicture.src = filePath;
    newPicture.type = pictureDto.type;
    newPicture.date = pictureDto.date;
    newPicture.description = pictureDto.description;

    return newPicture;
  }
}
