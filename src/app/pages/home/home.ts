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
      path: '/data/mock-users.json',
      description: '100 mock users served as a static JSON file for quick frontend and API testing.',
      examples: [{ label: 'Open JSON file', path: '/data/mock-users.json' }],
    },
    {
      name: 'Sample Orders',
      path: '/data/sample-orders.json',
      description: '200 sample orders served as a static JSON file for UI flows, demos, and API checks.',
      examples: [{ label: 'Open JSON file', path: '/data/sample-orders.json' }],
    },
    {
      name: 'JSON Datatypes Demo',
      path: '/data/json-datatypes-demo.json',
      description: '100 sample records designed to demonstrate common JSON datatypes in a static file.',
      nestingPath: 'store --> featuredProduct',
      examples: [{ label: 'Open JSON file', path: '/data/json-datatypes-demo.json' }],
    },
    {
      name: 'Nested Store Catalogs',
      path: '/data/nested-store-catalogs.json',
      description:
        '50 nested e-commerce store records with categories, products, and variants in a static JSON file.',
      nestingPath: 'store --> categories --> products --> variants',
      examples: [{ label: 'Open JSON file', path: '/data/nested-store-catalogs.json' }],
    },
  ];
}
