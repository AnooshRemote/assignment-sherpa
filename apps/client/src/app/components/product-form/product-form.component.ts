import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VisaProductsService } from '../../services/visa-products.service';
import { EntryType, CreateVisaProduct } from '../../models/visa-product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  error: string | null = null;
  entryTypes = Object.values(EntryType);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private visaProductsService: VisaProductsService
  ) {
    this.form = this.fb.group({
      country: ['', [Validators.required, Validators.minLength(2)]],
      visaType: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      lengthOfStay: [1, [Validators.required, Validators.min(1)]],
      numberOfEntries: [EntryType.SINGLE, Validators.required],
      filingFee: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.loading = true;
    this.error = null;

    this.visaProductsService.getProduct(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          country: product.country,
          visaType: product.visaType,
          price: product.price,
          lengthOfStay: product.lengthOfStay,
          numberOfEntries: product.numberOfEntries,
          filingFee: product.filingFee,
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. It may not exist.';
        this.loading = false;
        console.error('Error loading product:', err);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.loading = true;
    this.error = null;

    const productData: CreateVisaProduct = this.form.value;

    if (this.isEditMode && this.productId) {
      this.visaProductsService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.router.navigate(['/products', this.productId]);
        },
        error: (err) => {
          this.error = 'Failed to update product. Please try again.';
          this.loading = false;
          console.error('Error updating product:', err);
        },
      });
    } else {
      this.visaProductsService.createProduct(productData).subscribe({
        next: (product) => {
          this.router.navigate(['/products', product.id]);
        },
        error: (err) => {
          this.error = 'Failed to create product. Please try again.';
          this.loading = false;
          console.error('Error creating product:', err);
        },
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${fieldName} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}

