import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
];
