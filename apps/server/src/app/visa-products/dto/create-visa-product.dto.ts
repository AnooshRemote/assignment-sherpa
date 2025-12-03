import { IsString, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';

export enum EntryType {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
}

export class CreateVisaProductDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  visaType: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  lengthOfStay: number;

  @IsEnum(EntryType)
  numberOfEntries: EntryType;

  @IsNumber()
  @Min(0)
  filingFee: number;
}

