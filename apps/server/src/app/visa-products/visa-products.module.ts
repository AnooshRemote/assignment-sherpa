import { Module } from '@nestjs/common';
import { VisaProductsService } from './visa-products.service';
import { VisaProductsController } from './visa-products.controller';

@Module({
  controllers: [VisaProductsController],
  providers: [VisaProductsService],
  exports: [VisaProductsService],
})
export class VisaProductsModule {}

