import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  CAR_REPOSITORY,
  ICarRepository,
} from '@/modules/car/application/repository/car.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@/modules/user/application/repository/user.repository.interface';

import { Rent } from '../../domain/rent.domain';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';
import { RentMapper } from '../mapper/rent.mapper';
import {
  IRentRepository,
  RENT_REPOSITORY,
} from '../repository/rent.repository.interface';

@Injectable()
export class RentService {
  constructor(
    @Inject(RENT_REPOSITORY)
    private readonly rentRepository: IRentRepository,
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: ICarRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(RentMapper)
    private readonly rentMapper: RentMapper,
  ) {}

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    const user = await this.userRepository.findById(createRentDto.user);
    if (!user)
      throw new NotFoundException(
        `User with id ${createRentDto.user} not found`,
      );

    const admin = await this.userRepository.findById(createRentDto.admin);
    if (!admin)
      throw new NotFoundException(
        `Admin with id ${createRentDto.admin} not found`,
      );

    const car = await this.carRepository.findById(createRentDto.car);
    if (!car)
      throw new NotFoundException(`Car with id ${createRentDto.car} not found`);

    const rent = this.rentMapper.fromDtoToEntity(createRentDto);
    rent.user = user;
    rent.admin = admin;
    rent.car = car;

    return await this.rentRepository.create(rent);
  }

  async findAll(): Promise<Rent[]> {
    return await this.rentRepository.findAll();
  }

  async findOne(id: number): Promise<Rent> {
    return await this.rentRepository.findById(id);
  }

  async update(id: number, updateRentDto: UpdateRentDto): Promise<Rent> {
    const rent = this.rentMapper.fromDtoToEntity(updateRentDto);

    return await this.rentRepository.update(id, rent);
  }

  async remove(id: number): Promise<boolean> {
    return await this.rentRepository.delete(id);
  }
}
