import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisaProductsService } from '../../services/visa-products.service';
import { CurrencyService } from '../../services/currency.service';
import { VisaProduct } from '../../models/visa-product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: VisaProduct | null = null;
  loading = false;
  error: string | null = null;
  selectedCurrency = 'USD';
  convertedPrice: number | null = null;
  supportedCurrencies: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visaProductsService: VisaProductsService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.loadSupportedCurrencies();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
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

  loadProduct(id: string) {
    this.loading = true;
    this.error = null;

    this.visaProductsService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        if (this.selectedCurrency !== 'USD') {
          this.convertPrice();
        }
      },
      error: (err) => {
        this.error = 'Failed to load product. It may not exist.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  convertPrice() {
    if (!this.product || this.selectedCurrency === 'USD') {
      this.convertedPrice = null;
      return;
    }

    this.currencyService.convert(this.product.price, 'USD', this.selectedCurrency).subscribe({
      next: (conversion) => {
        this.convertedPrice = conversion.converted;
      },
      error: (err) => {
        console.error('Failed to convert price:', err);
        this.convertedPrice = null;
      },
    });
  }

  onCurrencyChange() {
    this.convertPrice();
  }

  deleteProduct() {
    if (!this.product) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.visaProductsService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = 'Failed to delete product. Please try again.';
          console.error('Error deleting product:', err);
        },
      });
    }
  }

  getPrice(): number {
    if (this.selectedCurrency === 'USD' || !this.convertedPrice) {
      return this.product?.price || 0;
    }
    return this.convertedPrice;
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

