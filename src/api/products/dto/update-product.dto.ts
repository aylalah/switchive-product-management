import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsName } from '../../../utils/validation.util';

export class UpdateProductDto extends PartialType(CreateProductDto) {

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

export class GetProductParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  per_page: number = 12;

//   @ApiProperty({ required: false })
//   @IsOptional()
//   category_id?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}