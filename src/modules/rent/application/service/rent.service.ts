import { Inject, Injectable } from '@nestjs/common';

import { Rent } from '../../domain/rent.domain';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { RentMapper } from '../mapper/rent.mapper';
import {
  IRentRepository,
  RENT_REPOSITORY,
} from '../repository/rent.interface.repository';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: IRentRepository,
    @Inject(RentMapper)
    private readonly rentMapper: RentMapper,
  ) {}

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    const rent = this.rentMapper.fromDtoToObject(createRentDto);
    return await this.rentRepository.create(rent);
  }

  async findAll(): Promise<Rent[]> {
    return await this.rentRepository.findAll();
  }

  async findOne(id: number): Promise<Rent> {
    return await this.rentRepository.findById(id);
  }

  async update(id: number, updateRentDto: UpdateRentDto): Promise<Rent> {
    const rent = this.rentMapper.fromDtoToObject(updateRentDto);

    return await this.rentRepository.update(id, rent);
  }

  async remove(id: number): Promise<boolean> {
    return await this.rentRepository.delete(id);
  }
}
