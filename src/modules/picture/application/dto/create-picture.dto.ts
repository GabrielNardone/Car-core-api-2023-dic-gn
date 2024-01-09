import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { CarPicture } from '../../domain/car-picture.enum';

export class CreatePictureDto {
  @IsNumber()
  car: number;

  @IsString()
  @Length(3, 21)
  src: string;

  @IsString()
  @Length(3, 21)
  description: string;

  @IsString()
  @Length(3, 21)
  title: string;

  @IsEnum(CarPicture)
  type: CarPicture;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
