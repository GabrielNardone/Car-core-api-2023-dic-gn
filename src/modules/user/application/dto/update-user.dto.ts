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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 21)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 21)
  lastName?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dob?: Date;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  externalId?: string;
}
