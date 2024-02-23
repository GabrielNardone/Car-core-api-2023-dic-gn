import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ConfirmPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmationCode: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Invalid password',
  })
  newPassword: string;
}
