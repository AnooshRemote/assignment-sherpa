import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CurrencyConversion {
  amount: number;
  from: string;
  to: string;
  converted: number;
  rate: number;
}

export interface SupportedCurrencies {
  currencies: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = 'http://localhost:3000/api/currency';

  constructor(private http: HttpClient) {}

  convert(amount: number, from: string, to: string): Observable<CurrencyConversion> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('from', from)
      .set('to', to);

    return this.http.get<CurrencyConversion>(`${this.apiUrl}/convert`, { params });
  }

  getSupportedCurrencies(): Observable<SupportedCurrencies> {
    return this.http.get<SupportedCurrencies>(`${this.apiUrl}/supported`);
  }
}

