# EasyJSON

EasyJSON is a lightweight mock JSON service built for testing, prototyping, demos, and learning.

It provides simple JSON endpoints that can be opened directly in the browser or used from tools like Postman, frontend apps, mobile apps, and QA workflows.

## What It Does

- Serves static sample JSON responses through clean HTTP endpoints
- Supports pagination-style query parameters such as `limit`, `offset`, `page`, and `pageSize`
- Includes both flat and nested sample datasets
- Tracks endpoint usage with persisted hit counters
- Provides a simple Angular UI to browse endpoints and open responses quickly

## Available Endpoints

### `GET /mock-users`

Returns a mock user dataset.

Example fields:

```json
{
  "id": 101,
  "name": "Ava Thompson",
  "email": "ava.thompson@example.com",
  "role": "admin",
  "active": false
}
```

### `GET /sample-orders`

Returns sample order data for UI and API testing.

Example fields:

```json
{
  "orderId": "ORD-1001",
  "customer": "Ava Thompson",
  "status": "processing",
  "total": 23.5,
  "items": 1,
  "currency": "USD",
  "region": "us-east",
  "placedAt": "2026-03-01T08:00:00.000Z"
}
```

### `GET /json-datatypes-demo`

Returns records designed to demonstrate common JSON datatypes.

Structure:

`store --> featuredProduct`

Example fields:

```json
{
  "store": "EasyJSON Demo Shop 1",
  "version": 1,
  "isActive": true,
  "notes": null,
  "tags": ["demo", "catalog", "typing"],
  "featuredProduct": {
    "id": 501,
    "name": "Wireless Keyboard 1"
  }
}
```

### `GET /nested-store-catalogs`

Returns nested e-commerce sample data.

Structure:

`store --> categories --> products --> variants`

Example fields:

```json
{
  "storeId": "store-001",
  "storeName": "Urban Cart Branch 1",
  "currency": "USD",
  "categories": [
    {
      "categoryId": "cat-01-1",
      "categoryName": "Electronics",
      "products": [
        {
          "productId": "prd-01-01",
          "name": "Wireless Headphones 1",
          "price": 130.84,
          "variants": [
            {
              "variantId": "var-01-01-1",
              "color": "Black",
              "stock": 17
            }
          ]
        }
      ]
    }
  ]
}
```

## Query Parameters

All dataset endpoints support the following pagination-style options:

- `limit`
- `offset`
- `page`
- `pageSize`

Examples:

```bash
/mock-users?limit=10
/mock-users?offset=20&limit=10
/sample-orders?page=2&pageSize=25
/nested-store-catalogs?limit=5
```

Behavior:

- If `page` or `pageSize` is provided, page-based slicing is used
- Otherwise, `offset` and `limit` are used
- If no query params are provided, the full dataset is returned

## Hit Tracking

EasyJSON tracks how many times each dataset endpoint is called.

### Stats endpoint

`GET /api/request-stats`

Example response:

```json
{
  "mock-users": 0,
  "sample-orders": 300,
  "json-datatypes-demo": 0,
  "nested-store-catalogs": 0
}
```

### How hit persistence works

- Each dataset has its own public stats file under `public/data/stats/`
- Hits are counted in memory first
- Counts are flushed to the stats file in batches of `100`
- This keeps endpoint access fast and avoids writing to disk on every request

Important note:

- The displayed hit count is persisted, not live
- If the server restarts before a batch flush, pending in-memory hits are lost

## Project Structure

```text
public/data/
  mock-users.json
  sample-orders.json
  json-datatypes-demo.json
  nested-store-catalogs.json
  stats/
    mock-users.json
    sample-orders.json
    json-datatypes-demo.json
    nested-store-catalogs.json

src/server.ts
src/app/pages/home/
src/app/pages/about/
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

## Build

Create a production build:

```bash
npm run build
```

## Run Tests

Run the unit tests:

```bash
npm test
```

## SSR Server

After building, you can run the SSR server with:

```bash
npm run serve:ssr:easyjson
```

## Tech Stack

- Angular 21
- Angular SSR
- Express
- Angular Material
- Bootstrap
- Vitest

## Use Cases

- Frontend development against predictable JSON responses
- QA testing for pagination and response handling
- Postman and API client demos
- Learning JSON structures and nested responses
- Mock data for onboarding, tutorials, and prototypes
