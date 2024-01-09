import { Inject, Injectable } from '@nestjs/common';

import { Picture } from '../../domain/picture.domain';
import { CreatePictureDto } from '../dto/create-picture.dto';
import { UpdatePictureDto } from '../dto/update-picture.dto';
import { PictureMapper } from '../mapper/picture.mapper';
import {
  IPictureRepository,
  PICTURE_REPOSITORY,
} from '../repository/picture.interface.repository';

@Injectable()
export class PictureService {
  constructor(
    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: IPictureRepository,
    @Inject(PictureMapper)
    private readonly pictureMapper: PictureMapper,
  ) {}

  async create(createPictureDto: CreatePictureDto): Promise<Picture> {
    const picture = this.pictureMapper.fromDtoToEntity(createPictureDto);

    return await this.pictureRepository.create(picture);
  }

  async findAll(): Promise<Picture[]> {
    return await this.pictureRepository.findAll();
  }

  async findOne(id: number): Promise<Picture> {
    return await this.pictureRepository.findById(id);
  }

  async update(
    id: number,
    updatePictureDto: UpdatePictureDto,
  ): Promise<Picture> {
    const picture = this.pictureMapper.fromDtoToEntity(updatePictureDto);

    return await this.pictureRepository.update(id, picture);
  }

  async remove(id: number): Promise<boolean> {
    return await this.pictureRepository.delete(id);
  }
}
