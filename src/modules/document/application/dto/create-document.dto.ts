import { IsNumber, IsString, Length, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(3)
  url: string;

  @IsString()
  @MinLength(3)
  src: string;

  @IsString()
  @Length(3, 120)
  description: string;

  @IsString()
  @Length(3, 40)
  title: string;

  @IsNumber()
  user: number;
}
