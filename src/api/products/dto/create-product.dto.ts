import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class CreateProductDto {

    @IsOptional()
    @IsString()
  @Length(1, 100)
  @ApiProperty()
  category: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiProperty()
  product_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 52)
  @ApiProperty()
  description: string;
  
  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsString()
  @Length(1, 220)
  @ApiProperty()
  price?: string;

}
