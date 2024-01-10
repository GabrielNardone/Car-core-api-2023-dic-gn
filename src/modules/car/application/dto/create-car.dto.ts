import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @Length(3, 21)
  brand: string;

  @IsString()
  @Length(3, 21)
  model: string;

  @IsString()
  @Length(3, 21)
  color: string;

  @IsNumber()
  @Min(1)
  @Max(8)
  passengers: number;

  @IsBoolean()
  ac: boolean;

  @IsNumber()
  @IsPositive()
  pricePerDay: number;
}
