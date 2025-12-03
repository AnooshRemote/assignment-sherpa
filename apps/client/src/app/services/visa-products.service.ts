import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisaProduct, CreateVisaProduct, VisaProductsResponse, QueryParams } from '../models/visa-product.model';

@Injectable({
  providedIn: 'root',
})
export class VisaProductsService {
  private apiUrl = 'http://localhost:3000/api/visa-products';

  constructor(private http: HttpClient) {}

  getProducts(params: QueryParams = {}): Observable<VisaProductsResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.country) httpParams = httpParams.set('country', params.country);
    if (params.visaType) httpParams = httpParams.set('visaType', params.visaType);
    if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.numberOfEntries) httpParams = httpParams.set('numberOfEntries', params.numberOfEntries);

    return this.http.get<VisaProductsResponse>(this.apiUrl, { params: httpParams });
  }

  getProduct(id: string): Observable<VisaProduct> {
    return this.http.get<VisaProduct>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateVisaProduct): Observable<VisaProduct> {
    return this.http.post<VisaProduct>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<CreateVisaProduct>): Observable<VisaProduct> {
    return this.http.patch<VisaProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

