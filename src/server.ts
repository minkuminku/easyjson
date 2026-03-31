import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const hitCounterBatchSize = 100;

app.set('json spaces', 2);

type MockUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

type SampleOrder = {
  orderId: string;
  customer: string;
  status: string;
  total: number;
  items: number;
  currency: string;
  region: string;
  placedAt: string;
};

type JsonDatatypesDemo = {
  store: string;
  version: number;
  isActive: boolean;
  notes: string | null;
  tags: string[];
  featuredProduct: {
    id: number;
    name: string;
  };
};

type NestedStoreCatalog = {
  storeId: string;
  storeName: string;
  currency: string;
  categories: {
    categoryId: string;
    categoryName: string;
    products: {
      productId: string;
      name: string;
      price: number;
      variants: {
        variantId: string;
        color: string;
        stock: number;
      }[];
    }[];
  }[];
};

type HitCounterFile = {
  hits: number;
};

const trackedDatasets = [
  'mock-users',
  'sample-orders',
  'json-datatypes-demo',
  'nested-store-catalogs',
] as const;

type TrackedDataset = (typeof trackedDatasets)[number];

const pendingHitCounts: Record<TrackedDataset, number> = {
  'mock-users': 0,
  'sample-orders': 0,
  'json-datatypes-demo': 0,
  'nested-store-catalogs': 0,
};

const resolveDataFilePath = (fileName: string): string => {
  const candidatePaths = [
    join(process.cwd(), `public/data/${fileName}`),
    join(browserDistFolder, `data/${fileName}`),
  ];

  const resolvedPath = candidatePaths.find((candidatePath) => existsSync(candidatePath));
  if (!resolvedPath) {
    throw new Error(`${fileName} could not be found in public/data or browser/data`);
  }

  return resolvedPath;
};

const resolveStatsDirectory = (): string => {
  const statsDirectory = join(process.cwd(), 'public/data/stats');
  mkdirSync(statsDirectory, { recursive: true });
  return statsDirectory;
};

const resolveStatsFilePath = (dataset: TrackedDataset): string =>
  join(resolveStatsDirectory(), `${dataset}.json`);

const readPersistedHitCount = (dataset: TrackedDataset): number => {
  const statsFilePath = resolveStatsFilePath(dataset);

  if (!existsSync(statsFilePath)) {
    return 0;
  }

  const stats = JSON.parse(readFileSync(statsFilePath, 'utf-8')) as HitCounterFile;
  return typeof stats.hits === 'number' && Number.isFinite(stats.hits) ? stats.hits : 0;
};

const writePersistedHitCount = (dataset: TrackedDataset, hits: number): void => {
  writeFileSync(resolveStatsFilePath(dataset), `${JSON.stringify({ hits }, null, 2)}\n`, 'utf-8');
};

const flushPendingHits = (dataset: TrackedDataset): void => {
  const pendingHits = pendingHitCounts[dataset];

  if (pendingHits <= 0) {
    return;
  }

  writePersistedHitCount(dataset, readPersistedHitCount(dataset) + pendingHits);
  pendingHitCounts[dataset] = 0;
};

const recordHit = (dataset: TrackedDataset): void => {
  pendingHitCounts[dataset] += 1;

  if (pendingHitCounts[dataset] >= hitCounterBatchSize) {
    flushPendingHits(dataset);
  }
};

const readAllPersistedHitCounts = (): Record<TrackedDataset, number> =>
  trackedDatasets.reduce(
    (counts, dataset) => {
      counts[dataset] = readPersistedHitCount(dataset);
      return counts;
    },
    {} as Record<TrackedDataset, number>,
  );

const readMockUsers = (): MockUser[] =>
  JSON.parse(readFileSync(resolveDataFilePath('mock-users.json'), 'utf-8')) as MockUser[];

const readSampleOrders = (): SampleOrder[] =>
  JSON.parse(readFileSync(resolveDataFilePath('sample-orders.json'), 'utf-8')) as SampleOrder[];

const readJsonDatatypesDemo = (): JsonDatatypesDemo[] =>
  JSON.parse(
    readFileSync(resolveDataFilePath('json-datatypes-demo.json'), 'utf-8'),
  ) as JsonDatatypesDemo[];

const readNestedStoreCatalogs = (): NestedStoreCatalog[] =>
  JSON.parse(
    readFileSync(resolveDataFilePath('nested-store-catalogs.json'), 'utf-8'),
  ) as NestedStoreCatalog[];

const parsePositiveInteger = (value: unknown): number | null => {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseNonNegativeInteger = (value: unknown): number | null => {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const sliceCollection = <T>(items: T[], query: Record<string, unknown>): T[] => {
  const page = parsePositiveInteger(query['page']);
  const pageSize = parsePositiveInteger(query['pageSize']);

  if (page !== null || pageSize !== null) {
    const currentPage = page ?? 1;
    const currentPageSize = pageSize ?? items.length;
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;

    return items.slice(start, end);
  }

  const offset = parseNonNegativeInteger(query['offset']) ?? 0;
  const limit = parsePositiveInteger(query['limit']);

  return limit === null ? items : items.slice(offset, offset + limit);
};

app.get('/mock-users', (req, res) => {
  recordHit('mock-users');
  res.json(sliceCollection(readMockUsers(), req.query));
});

app.get('/sample-orders', (req, res) => {
  recordHit('sample-orders');
  res.json(sliceCollection(readSampleOrders(), req.query));
});

app.get('/json-datatypes-demo', (req, res) => {
  recordHit('json-datatypes-demo');
  res.json(sliceCollection(readJsonDatatypesDemo(), req.query));
});

app.get('/nested-store-catalogs', (req, res) => {
  recordHit('nested-store-catalogs');
  res.json(sliceCollection(readNestedStoreCatalogs(), req.query));
});

app.get('/api/request-stats', (_req, res) => {
  res.json(readAllPersistedHitCounts());
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
