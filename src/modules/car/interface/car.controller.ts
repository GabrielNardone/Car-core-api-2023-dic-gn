import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Public } from '@/modules/auth/application/decorator/public-route.decorator';
import { RoleProtected } from '@/modules/auth/application/decorator/roles.decorator';
import { Role } from '@/modules/user/domain/format.enum';

import { CreateCarDto } from '../application/dto/create-car.dto';
import { UpdateCarDto } from '../application/dto/update-car.dto';
import { CarService } from '../application/services/car.service';
import { Car } from '../domain/car.domain';

@Controller('car')
@Public()
@RoleProtected(Role.ADMIN)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carService.create(createCarDto);
  }

  @Get()
  @RoleProtected(Role.CLIENT)
  findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Get(':id')
  @RoleProtected(Role.CLIENT)
  findOne(@Param('id') id: number): Promise<Car> {
    return this.carService.findOne(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.carService.remove(id);
  }
}
