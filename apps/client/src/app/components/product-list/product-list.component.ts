import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisaProductsService } from '../../services/visa-products.service';
import { CurrencyService } from '../../services/currency.service';
import { VisaProduct, EntryType, QueryParams } from '../../models/visa-product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: VisaProduct[] = [];
  total = 0;
  page = 1;
  limit = 10;
  totalPages = 0;
  
  filters: QueryParams = {
    country: '',
    visaType: '',
    minPrice: undefined,
    maxPrice: undefined,
    numberOfEntries: undefined,
  };
  
  selectedCurrency = 'USD';
  supportedCurrencies: string[] = [];
  convertedPrices: Map<string, number> = new Map();
  loading = false;
  error: string | null = null;

  constructor(
    private visaProductsService: VisaProductsService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.loadSupportedCurrencies();
    this.loadProducts();
  }

  loadSupportedCurrencies() {
    this.currencyService.getSupportedCurrencies().subscribe({
      next: (response) => {
        this.supportedCurrencies = response.currencies;
      },
      error: (err) => {
        console.error('Failed to load currencies:', err);
      },
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    
    const params: QueryParams = {
      page: this.page,
      limit: this.limit,
      ...this.filters,
    };

    // Remove empty filters
    Object.keys(params).forEach((key) => {
      const value = params[key as keyof QueryParams];
      if (value === '' || value === undefined || value === null) {
        delete params[key as keyof QueryParams];
      }
    });

    this.visaProductsService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.data;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.totalPages = response.totalPages;
        this.loading = false;
        
        if (this.selectedCurrency !== 'USD') {
          this.convertPrices();
        }
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      },
    });
  }

  convertPrices() {
    if (this.selectedCurrency === 'USD') {
      this.convertedPrices.clear();
      return;
    }

    this.products.forEach((product) => {
      this.currencyService.convert(product.price, 'USD', this.selectedCurrency).subscribe({
        next: (conversion) => {
          this.convertedPrices.set(product.id, conversion.converted);
        },
        error: (err) => {
          console.error(`Failed to convert price for product ${product.id}:`, err);
        },
      });
    });
  }

  onCurrencyChange() {
    this.convertPrices();
  }

  onFilterChange() {
    this.page = 1; // Reset to first page when filters change
    this.loadProducts();
  }

  clearFilters() {
    this.filters = {
      country: '',
      visaType: '',
      minPrice: undefined,
      maxPrice: undefined,
      numberOfEntries: undefined,
    };
    this.page = 1;
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadProducts();
    }
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.visaProductsService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.error = 'Failed to delete product. Please try again.';
          console.error('Error deleting product:', err);
        },
      });
    }
  }

  getPrice(product: VisaProduct): number {
    if (this.selectedCurrency === 'USD') {
      return product.price;
    }
    return this.convertedPrices.get(product.id) || product.price;
  }

  getCurrencySymbol(): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      AUD: 'A$',
      CAD: 'C$',
      INR: '₹',
      BRL: 'R$',
      MXN: '$',
    };
    return symbols[this.selectedCurrency] || this.selectedCurrency;
  }
}

