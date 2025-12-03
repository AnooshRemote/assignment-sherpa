import { PartialType } from '@nestjs/mapped-types';
import { CreateVisaProductDto } from './create-visa-product.dto';

export class UpdateVisaProductDto extends PartialType(CreateVisaProductDto) {}

