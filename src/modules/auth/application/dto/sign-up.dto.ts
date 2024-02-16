import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @IsString()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @Length(3, 21)
  firstName: string;

  @IsString()
  @Length(3, 21)
  lastName: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dob: Date;

  @IsString()
  address: string;

  @IsString()
  country: string;
}
