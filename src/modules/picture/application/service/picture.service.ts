import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  FILE_UPLOAD_SERVICE,
  IFileUploadService,
} from '@/common/application/repository/file-upload.repository.interface';
import { CarService } from '@/modules/car/application/services/car.service';

import { Picture } from '../../domain/picture.domain';
import { CreatePictureDto } from '../dto/create-picture.dto';
import { PictureMapper } from '../mapper/picture.mapper';
import {
  IPictureRepository,
  PICTURE_REPOSITORY,
} from '../repository/picture.repository.interface';

@Injectable()
export class PictureService {
  constructor(
    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: IPictureRepository,
    @Inject(PictureMapper)
    private readonly pictureMapper: PictureMapper,
    @Inject(FILE_UPLOAD_SERVICE)
    private readonly fileUploadService: IFileUploadService,
    private readonly carService: CarService,
  ) {}

  async create(
    createPictureDto: CreatePictureDto,
    file: Buffer,
    id: number,
  ): Promise<Picture> {
    try {
      const filePath = await this.fileUploadService.uploadFiles(file);
      const car = await this.carService.findOne(id);

      if (!car) {
        throw new NotFoundException(`Car with id ${id} does´nt exist`);
      }

      const picture = this.pictureMapper.fromDtoToEntity(
        createPictureDto,
        filePath,
      );
      picture.car = car;

      return await this.pictureRepository.create(picture);
    } catch (error) {
      console.error('Error creating picture:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    return await this.pictureRepository.delete(id);
  }
}
