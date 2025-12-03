import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VisaProductsService } from './visa-products.service';
import { CreateVisaProductDto } from './dto/create-visa-product.dto';
import { UpdateVisaProductDto } from './dto/update-visa-product.dto';
import { QueryVisaProductsDto } from './dto/query-visa-products.dto';

@Controller('visa-products')
export class VisaProductsController {
  constructor(private readonly visaProductsService: VisaProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVisaProductDto: CreateVisaProductDto) {
    return this.visaProductsService.create(createVisaProductDto);
  }

  @Get()
  findAll(@Query() query: QueryVisaProductsDto) {
    return this.visaProductsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visaProductsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisaProductDto: UpdateVisaProductDto,
  ) {
    return this.visaProductsService.update(id, updateVisaProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.visaProductsService.remove(id);
  }
}

