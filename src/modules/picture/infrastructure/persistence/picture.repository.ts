import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IPictureRepository } from '../../application/repository/picture.interface.repository';
import { Picture } from '../../domain/picture.domain';
import { PictureSchema } from './picture.schema';

@Injectable()
export class PictureRepository implements IPictureRepository {
  constructor(
    @InjectRepository(PictureSchema)
    private readonly pictureRepository: Repository<Picture>,
  ) {}

  async create(picture: Picture): Promise<Picture> {
    return await this.pictureRepository.save(picture);
  }

  async findAll(): Promise<Picture[]> {
    return await this.pictureRepository.find();
  }

  async findById(id: number): Promise<Picture> {
    const picture = await this.pictureRepository.findOneBy({ id });

    if (!picture) {
      throw new NotFoundException(`Picture with id ${id} not found`);
    }

    return picture;
  }

  async update(id: number, picture: Picture): Promise<Picture> {
    const updatedPicture = await this.pictureRepository.preload({
      id,
      ...picture,
    });

    if (!updatedPicture) {
      throw new NotFoundException(`Picture with id ${id} not found`);
    }

    return await this.pictureRepository.save(updatedPicture);
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.pictureRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Picture with id ${id} not found`);
    }

    return true;
  }
}
