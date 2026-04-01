import { Injectable, inject } from '@angular/core';
import { JsonEndpointCard } from '../models/json-endpoint-card';
import { ApiJsonService } from './api-json.service';

@Injectable({
  providedIn: 'root',
})
export class JsonEndpointCatalogService {
  private readonly apiJsonService = inject(ApiJsonService);

  getStaticCards(): JsonEndpointCard[] {
    return [
      {
        name: 'Mock Users',
        path: '/data/mock-users.json',
        description: '100 mock users served as a static JSON file for quick frontend and API testing.',
        source: 'static',
        status: 'Static JSON',
        examples: [{ label: 'Open JSON file', path: '/data/mock-users.json' }],
      },
      {
        name: 'Sample Orders',
        path: '/data/sample-orders.json',
        description: '200 sample orders served as a static JSON file for UI flows, demos, and API checks.',
        source: 'static',
        status: 'Static JSON',
        examples: [{ label: 'Open JSON file', path: '/data/sample-orders.json' }],
      },
      {
        name: 'JSON Datatypes Demo',
        path: '/data/json-datatypes-demo.json',
        description: '100 sample records designed to demonstrate common JSON datatypes in a static file.',
        source: 'static',
        status: 'Static JSON',
        nestingPath: 'store --> featuredProduct',
        examples: [{ label: 'Open JSON file', path: '/data/json-datatypes-demo.json' }],
      },
      {
        name: 'Nested Store Catalogs',
        path: '/data/nested-store-catalogs.json',
        description:
          '50 nested e-commerce store records with categories, products, and variants in a static JSON file.',
        source: 'static',
        status: 'Static JSON',
        nestingPath: 'store --> categories --> products --> variants',
        examples: [{ label: 'Open JSON file', path: '/data/nested-store-catalogs.json' }],
      },
    ];
  }

  getApiCards(): JsonEndpointCard[] {
    return [this.apiJsonService.datatypeDemoCard];
  }
}
