import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisaProductsModule } from './visa-products/visa-products.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [VisaProductsModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
