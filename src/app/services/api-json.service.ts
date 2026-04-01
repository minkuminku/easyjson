import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JsonEndpointCard } from '../models/json-endpoint-card';

export type DatatypeDemoQuery = {
  page?: number;
  pageSize?: number;
};

@Injectable({
  providedIn: 'root',
})
export class ApiJsonService {
  private readonly http = inject(HttpClient);
  private readonly basePath =
    'https://api.easyjsondata.org/api/json-datatypes-demo';

  readonly datatypeDemoCard: JsonEndpointCard = {
    name: 'JSON Datatypes Demo API',
    path: this.basePath,
    description:
      'JSON datatype demo endpoint served from the API with paginated access and direct record lookups.',
    source: 'api',
    status: 'API',
    capabilities: [
      {
        label: 'Pagination',
        detail: 'Supports page and pageSize query params.',
      },
      {
        label: 'Lookup by id',
        detail: 'Supports direct record fetches by id.',
      },
    ],
    examples: [
      { label: 'List records', path: this.basePath },
      { label: 'Page 1, 10 items', path: `${this.basePath}?page=1&pageSize=10` },
      { label: 'Fetch record by id', path: `${this.basePath}/501` },
    ],
  };

  getDatatypeDemo(query?: DatatypeDemoQuery) {
    let params = new HttpParams();

    if (query?.page !== undefined) {
      params = params.set('page', query.page);
    }

    if (query?.pageSize !== undefined) {
      params = params.set('pageSize', query.pageSize);
    }

    return this.http.get(this.basePath, { params });
  }

  getDatatypeDemoById(id: number | string) {
    return this.http.get(`${this.basePath}/${id}`);
  }
}
