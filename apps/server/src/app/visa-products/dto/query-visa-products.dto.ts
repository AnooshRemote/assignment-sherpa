import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EntryType } from './create-visa-product.dto';

export class QueryVisaProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  visaType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(EntryType)
  numberOfEntries?: EntryType;
}

