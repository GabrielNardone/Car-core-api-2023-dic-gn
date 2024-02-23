import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(20)
  @IsString()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Invalid password',
  })
  password: string;
}
