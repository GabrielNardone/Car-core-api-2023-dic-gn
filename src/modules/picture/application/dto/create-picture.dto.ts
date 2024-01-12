import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsString, Length } from 'class-validator';

import { CarPicture } from '../../domain/car-picture.enum';

export class CreatePictureDto {
  @IsString()
  @Length(3, 120)
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
