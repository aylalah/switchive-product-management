import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreateUserDto {

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsName()
  @Length(1, 52)
  @ApiProperty()
  last_name: string;

  @IsEmail()
  @Length(1, 52)
  @ApiProperty()
  email: string;
  
  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiPropertyOptional()
  password?: string;

}
