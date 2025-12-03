import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert')
  async convert(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum < 0) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
    }

    if (!from || !to) {
      throw new HttpException('from and to currencies are required', HttpStatus.BAD_REQUEST);
    }

    const converted = await this.currencyService.convert(amountNum, from, to);
    
    return {
      amount: amountNum,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      converted,
      rate: converted / amountNum,
    };
  }

  @Get('supported')
  getSupportedCurrencies() {
    return {
      currencies: this.currencyService.getSupportedCurrencies(),
    };
  }
}

