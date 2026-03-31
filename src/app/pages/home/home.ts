import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

type DatasetKey =
  | 'mock-users'
  | 'sample-orders'
  | 'json-datatypes-demo'
  | 'nested-store-catalogs';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly hitCounts = signal<Record<DatasetKey, number>>({
    'mock-users': 0,
    'sample-orders': 0,
    'json-datatypes-demo': 0,
    'nested-store-catalogs': 0,
  });
  protected readonly jsonLinks = [
    {
      name: 'Mock Users',
      path: '/data/mock-users.json',
      statsKey: 'mock-users' as const,
      description: '100 mock users served as a static JSON file for quick frontend and API testing.',
      examples: [{ label: 'Open JSON file', path: '/data/mock-users.json' }],
    },
    {
      name: 'Sample Orders',
      path: '/data/sample-orders.json',
      statsKey: 'sample-orders' as const,
      description: '200 sample orders served as a static JSON file for UI flows, demos, and API checks.',
      examples: [{ label: 'Open JSON file', path: '/data/sample-orders.json' }],
    },
    {
      name: 'JSON Datatypes Demo',
      path: '/data/json-datatypes-demo.json',
      statsKey: 'json-datatypes-demo' as const,
      description: '100 sample records designed to demonstrate common JSON datatypes in a static file.',
      nestingPath: 'store --> featuredProduct',
      examples: [{ label: 'Open JSON file', path: '/data/json-datatypes-demo.json' }],
    },
    {
      name: 'Nested Store Catalogs',
      path: '/data/nested-store-catalogs.json',
      statsKey: 'nested-store-catalogs' as const,
      description:
        '50 nested e-commerce store records with categories, products, and variants in a static JSON file.',
      nestingPath: 'store --> categories --> products --> variants',
      examples: [{ label: 'Open JSON file', path: '/data/nested-store-catalogs.json' }],
    },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.http
        .get<Partial<Record<DatasetKey, number>>>('/api/request-stats')
        .subscribe((counts) =>
          this.hitCounts.update((currentCounts) => ({
            ...currentCounts,
            ...counts,
          })),
        );
    }
  }
}
