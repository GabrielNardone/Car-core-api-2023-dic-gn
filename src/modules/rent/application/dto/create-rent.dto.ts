import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateRentDto {
  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @IsOptional()
  @IsDate()
  @Transform((target) => new Date(target.value))
  acceptedDate?: Date;

  @IsBoolean()
  rejected: boolean;

  @IsDate()
  @Transform((target) => new Date(target.value))
  startingDate: Date;

  @IsDate()
  @Transform((target) => new Date(target.value))
  dueDate: Date;

  @IsDate()
  @Transform((target) => new Date(target.value))
  endDate: Date;

  @IsNumber()
  user: number;

  @IsNumber()
  admin: number;

  @IsNumber()
  car: number;
}
