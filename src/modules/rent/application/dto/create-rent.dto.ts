import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsPositive } from 'class-validator';

export class CreateRentDto {
  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @IsDateString()
  @Transform((target) => new Date(target.value))
  acceptedDate: Date | null;

  @IsBoolean()
  rejected: boolean;

  @IsDateString()
  @Transform((target) => new Date(target.value))
  startingDate: Date;

  @IsDateString()
  @Transform((target) => new Date(target.value))
  dueDate: Date;

  @IsDateString()
  @Transform((target) => new Date(target.value))
  endDate: Date;
}
