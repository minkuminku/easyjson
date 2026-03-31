import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly jsonLinks = [
    {
      name: 'Mock Users',
      path: '/mock-users',
      description: '100 mock users with optional limit, offset, page, and pageSize support.',
      examples: [
        { label: 'All users', path: '/mock-users' },
        { label: 'First 10', path: '/mock-users?limit=10' },
        { label: 'Offset 20, limit 10', path: '/mock-users?offset=20&limit=10' },
        { label: 'Page 2, size 25', path: '/mock-users?page=2&pageSize=25' },
      ],
    },
    {
      name: 'Sample Orders',
      path: '/sample-orders',
      description: '200 sample orders with optional limit, offset, page, and pageSize support.',
      examples: [
        { label: 'All orders', path: '/sample-orders' },
        { label: 'First 10', path: '/sample-orders?limit=10' },
        { label: 'Offset 20, limit 10', path: '/sample-orders?offset=20&limit=10' },
        { label: 'Page 2, size 25', path: '/sample-orders?page=2&pageSize=25' },
      ],
    },
    {
      name: 'JSON Datatypes Demo',
      path: '/json-datatypes-demo',
      description: '100 sample records designed to exercise all JSON datatypes with optional pagination.',
      nestingPath: 'store --> featuredProduct',
      examples: [
        { label: 'All examples', path: '/json-datatypes-demo' },
        { label: 'First 10', path: '/json-datatypes-demo?limit=10' },
        { label: 'Offset 20, limit 10', path: '/json-datatypes-demo?offset=20&limit=10' },
        { label: 'Page 2, size 25', path: '/json-datatypes-demo?page=2&pageSize=25' },
      ],
    },
    {
      name: 'Nested Store Catalogs',
      path: '/nested-store-catalogs',
      description:
        '50 nested e-commerce store records with categories, products, and variants plus optional pagination.',
      nestingPath: 'store --> categories --> products --> variants',
      examples: [
        { label: 'All stores', path: '/nested-store-catalogs' },
        { label: 'First 5 stores', path: '/nested-store-catalogs?limit=5' },
        {
          label: 'Offset 10, limit 5',
          path: '/nested-store-catalogs?offset=10&limit=5',
        },
        {
          label: 'Page 2, size 10',
          path: '/nested-store-catalogs?page=2&pageSize=10',
        },
      ],
    },
  ];
}
