import type { Server } from 'node:http';
import express from 'express';
import { getTableName } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { auth } from '../auth/auth';
import { db } from '../db/client';
import { accountRouter } from './account';

jest.mock('../auth/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}));

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn((headers) => headers),
}));

jest.mock('../db/client', () => ({
  db: { select: jest.fn() },
}));

const getSession = auth.api.getSession as jest.Mock;
const select = db.select as jest.Mock;

describe('customer account API', () => {
  let server: Server;
  let baseUrl: string;
  let whereClauses: unknown[];

  beforeAll(async () => {
    const app = express();
    app.use('/api/account', accountRouter);
    app.use(
      (
        error: { statusCode?: number; message?: string },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        void _next;
        res
          .status(error.statusCode ?? 500)
          .json({ message: error.message ?? 'Internal server error' });
      },
    );
    server = app.listen(0);
    await new Promise<void>((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Test server did not bind to a TCP port');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    whereClauses = [];
    getSession.mockImplementation(
      ({ headers }: { headers: Record<string, string | undefined> }) => {
        const role = headers['x-test-role'];
        if (!role) return null;
        return {
          user: {
            id: headers['x-test-user-id'] ?? 'customer-one',
            name: 'Customer One',
            email: 'customer@example.com',
            role,
          },
          session: { id: 'test-session', createdAt: new Date() },
        };
      },
    );

    select.mockImplementation(() => ({
      from(table: Parameters<typeof getTableName>[0]) {
        return {
          where(condition: unknown) {
            whereClauses.push(condition);
            if (getTableName(table) === 'orders') {
              return {
                orderBy: () => ({
                  limit: async () => [
                    {
                      id: 'order-one',
                      publicId: 'TN-260101-001',
                      status: 'completed',
                      totalKes: 2500,
                      createdAt: new Date('2026-01-01T00:00:00.000Z'),
                    },
                  ],
                }),
              };
            }
            return Promise.resolve([
              {
                orderId: 'order-one',
                title: 'Vintage jacket',
                size: 'M',
                quantity: 1,
                unitPriceKes: 2500,
              },
            ]);
          },
        };
      },
    }));
  });

  it('requires an authenticated customer for account profile data', async () => {
    const anonymous = await fetch(`${baseUrl}/api/account/me`);
    expect(anonymous.status).toBe(401);

    const staff = await fetch(`${baseUrl}/api/account/me`, {
      headers: { 'x-test-role': 'support' },
    });
    expect(staff.status).toBe(403);

    const customer = await fetch(`${baseUrl}/api/account/me`, {
      headers: { 'x-test-role': 'customer' },
    });
    expect(customer.status).toBe(200);
    await expect(customer.json()).resolves.toEqual({
      user: {
        id: 'customer-one',
        name: 'Customer One',
        email: 'customer@example.com',
      },
    });
  });

  it('scopes customer orders by the authenticated user id', async () => {
    const response = await fetch(`${baseUrl}/api/account/orders`, {
      headers: {
        'x-test-role': 'customer',
        'x-test-user-id': 'customer-two',
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      orders: [
        {
          publicId: 'TN-260101-001',
          items: [{ title: 'Vintage jacket', unitPriceKes: 2500 }],
        },
      ],
    });

    const orderQuery = new PgDialect().sqlToQuery(
      whereClauses[0] as Parameters<PgDialect['sqlToQuery']>[0],
    );
    expect(orderQuery.sql).toContain('"orders"."user_id"');
    expect(orderQuery.params).toContain('customer-two');
  });
});
