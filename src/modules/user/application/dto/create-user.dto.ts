import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsString, Length } from 'class-validator';

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
}
