import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

interface ExchangeRateCache {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private cache: ExchangeRateCache | null = null;
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (fromCurrency !== 'USD') {
      throw new HttpException(
        'Base currency must be USD. Please convert from USD first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const rates = await this.getExchangeRates();
      const rate = rates[toCurrency.toUpperCase()];

      if (!rate) {
        throw new HttpException(
          `Currency ${toCurrency} is not supported`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      this.logger.error(`Currency conversion error: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      // Fallback to cached rates if API fails
      if (this.cache) {
        this.logger.warn('Using cached exchange rates due to API failure');
        const rate = this.cache.rates[toCurrency.toUpperCase()];
        if (rate) {
          return Math.round(amount * rate * 100) / 100;
        }
      }

      throw new HttpException(
        'Currency conversion service is temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async getExchangeRates(): Promise<Record<string, number>> {
    const now = Date.now();

    // Return cached rates if still valid
    if (this.cache && now - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.rates;
    }

    try {
      // Fetch fresh rates from API
      const response = await axios.get<{ rates: Record<string, number> }>(this.API_URL, {
        timeout: 5000, // 5 second timeout
      });

      this.cache = {
        rates: response.data.rates,
        base: 'USD',
        timestamp: now,
      };

      this.logger.log('Exchange rates updated successfully');
      return this.cache.rates;
    } catch (error) {
      this.logger.error(`Failed to fetch exchange rates: ${error.message}`);

      // If we have stale cache, use it
      if (this.cache) {
        this.logger.warn('Using stale cached exchange rates');
        return this.cache.rates;
      }

      throw error;
    }
  }

  getSupportedCurrencies(): string[] {
    // Common currencies supported by most exchange rate APIs
    return [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR',
      'BRL', 'MXN', 'RUB', 'ZAR', 'THB', 'VND', 'AED', 'ARS',
    ];
  }
}

