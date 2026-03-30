import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

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

const readMockUsers = (): MockUser[] =>
  JSON.parse(readFileSync(resolveDataFilePath('mock-users.json'), 'utf-8')) as MockUser[];

const readSampleOrders = (): SampleOrder[] =>
  JSON.parse(readFileSync(resolveDataFilePath('sample-orders.json'), 'utf-8')) as SampleOrder[];

const readJsonDatatypesDemo = (): JsonDatatypesDemo[] =>
  JSON.parse(
    readFileSync(resolveDataFilePath('json-datatypes-demo.json'), 'utf-8'),
  ) as JsonDatatypesDemo[];

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
  res.json(sliceCollection(readMockUsers(), req.query));
});

app.get('/sample-orders', (req, res) => {
  res.json(sliceCollection(readSampleOrders(), req.query));
});

app.get('/json-datatypes-demo', (req, res) => {
  res.json(sliceCollection(readJsonDatatypesDemo(), req.query));
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
