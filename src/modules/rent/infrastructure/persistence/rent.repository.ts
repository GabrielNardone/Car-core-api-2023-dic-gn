import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRentRepository } from '../../application/repository/rent.repository.interface';
import { Rent } from '../../domain/rent.domain';
import { RentSchema } from './rent.schema';

export class RentRepository implements IRentRepository {
  constructor(
    @InjectRepository(RentSchema)
    private readonly rentRepository: Repository<Rent>,
  ) {}

  async create(rent: Rent): Promise<Rent> {
    return await this.rentRepository.save(rent);
  }

  async findAll(): Promise<Rent[]> {
    return await this.rentRepository.find({
      relations: {
        user: true,
        car: true,
      },
    });
  }

  async findById(id: number): Promise<Rent> {
    const rent = await this.rentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        car: true,
      },
    });

    if (!rent) {
      throw new NotFoundException(`Rent with id ${id} not found`);
    }

    return rent;
  }

  async update(id: number, rent: Rent): Promise<Rent> {
    const updatedRent = await this.rentRepository.preload({
      id,
      ...rent,
    });

    if (!updatedRent) {
      throw new NotFoundException(`Rent with id ${id} not found`);
    }

    return updatedRent;
  }

  async delete(id: number): Promise<boolean> {
    const { affected } = await this.rentRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Rent with id ${id} not found`);
    }

    return true;
  }
}
