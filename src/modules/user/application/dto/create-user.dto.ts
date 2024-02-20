import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { Role } from '../../domain/format.enum';

export class CreateUserDto {
  @IsString()
  @Length(3, 21)
  firstName: string;

  @IsString()
  @Length(3, 21)
  lastName: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dob: Date;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsString()
  externalId: string;
}
