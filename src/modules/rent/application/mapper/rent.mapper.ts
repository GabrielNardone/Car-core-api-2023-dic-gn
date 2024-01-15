import { Injectable } from '@nestjs/common';

import { Rent } from '../../domain/rent.domain';
import { CreateRentDto } from '../dto/create-rent.dto';
import { UpdateRentDto } from '../dto/update-rent.dto';

@Injectable()
export class RentMapper {
  fromDtoToEntity(rent: CreateRentDto | UpdateRentDto) {
    const newRent = new Rent();
    newRent.pricePerDay = rent.pricePerDay;
    newRent.acceptedDate = rent.acceptedDate;
    newRent.startingDate = rent.startingDate;
    newRent.dueDate = rent.dueDate;
    newRent.endDate = rent.endDate;
    newRent.rejected = rent.rejected;

    return newRent;
  }
}
