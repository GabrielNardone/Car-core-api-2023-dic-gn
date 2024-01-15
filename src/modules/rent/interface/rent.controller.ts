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

import { CreateRentDto } from '../application/dto/create-rent.dto';
import { UpdateRentDto } from '../application/dto/update-rent.dto';
import { RentService } from '../application/service/rent.service';
import { Rent } from '../domain/rent.domain';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  create(@Body() createRentDto: CreateRentDto): Promise<Rent> {
    return this.rentService.create(createRentDto);
  }

  @Get()
  findAll(): Promise<Rent[]> {
    return this.rentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Rent> {
    return this.rentService.findOne(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRentDto: UpdateRentDto,
  ): Promise<Rent> {
    return this.rentService.update(id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.rentService.remove(id);
  }
}
