import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  FILE_UPLOAD_SERVICE,
  IFileUploadService,
} from '@/common/application/repository/file-upload.interface.repository';
import {
  CAR_REPOSITORY,
  ICarRepository,
} from '@/modules/car/application/repository/car.repository.interface';

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
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: ICarRepository,
  ) {}

  async create(
    createPictureDto: CreatePictureDto,
    file: Buffer,
    id: number,
  ): Promise<Picture> {
    try {
      const filePath = await this.fileUploadService.uploadFiles(file);
      const car = await this.carRepository.findById(id);

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
