import type { Server } from 'node:http';

const mockRequestLog = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('./lib/logger', () => ({
  createRequestLogger: jest.fn(() => mockRequestLog),
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('./config/env', () => ({
  env: {
    trustedOrigins: ['https://shop.example'],
    LOG_LEVEL: 'silent',
    NODE_ENV: 'test',
  },
  isDevelopment: false,
}));

jest.mock('./auth/auth', () => ({ auth: {} }));
jest.mock('./db/client', () => ({ db: {} }));
jest.mock('./middlewares/require-auth', () => ({
  requireSession: (
    _req: unknown,
    _res: unknown,
    next: (error?: Error) => void,
  ) => next(),
}));
jest.mock('./middlewares/require-role', () => ({
  requireStaffIdentity: [
    (_req: unknown, _res: unknown, next: (error?: Error) => void) => next(),
  ],
  requireCustomer: [
    (_req: unknown, _res: unknown, next: (error?: Error) => void) => next(),
  ],
  requireAdminRole: [],
  requireStaff: [
    (_req: unknown, _res: unknown, next: (error?: Error) => void) => next(),
  ],
  requireAdmin: [
    (_req: unknown, _res: unknown, next: (error?: Error) => void) => next(),
  ],
}));
jest.mock('better-auth/node', () => ({
  toNodeHandler:
    () =>
    (
      req: import('express').Request,
      res: import('express').Response,
      next: import('express').NextFunction,
    ) => {
      if (req.path.endsWith('/__test-error')) {
        next(new Error('sensitive upstream detail'));
        return;
      }

      res.setHeader(
        'Set-Cookie',
        'auth-session=test; Path=/; HttpOnly; SameSite=Lax',
      );
      res.status(200).json({
        url: req.originalUrl,
        bodyParsed: req.body !== undefined,
      });
    },
}));

import { createApp } from './app';

describe('API auth mount', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createApp().listen(0);
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

  it('routes the auth root and nested endpoints before body parsing', async () => {
    for (const path of ['/api/auth', '/api/auth/sign-in/email']) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'customer@example.com' }),
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        url: path,
        bodyParsed: false,
      });
      expect(response.headers.get('set-cookie')).toContain('auth-session=test');
    }
  });

  it('allows credentialed preflight requests from configured origins', async () => {
    const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'OPTIONS',
      headers: {
        origin: 'https://shop.example',
        'access-control-request-method': 'POST',
        'access-control-request-headers':
          'content-type,x-session-token,x-customer-account-consent',
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe(
      'https://shop.example',
    );
    expect(response.headers.get('access-control-allow-credentials')).toBe(
      'true',
    );
    expect(response.headers.get('access-control-allow-headers')).toContain(
      'x-session-token',
    );
    expect(response.headers.get('access-control-allow-headers')).toContain(
      'x-customer-account-consent',
    );
  });

  it('rejects untrusted origins with a safe error response', async () => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { origin: 'https://untrusted.example' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: 'Origin not allowed',
    });
  });

  it('does not expose unexpected auth handler errors', async () => {
    mockRequestLog.error.mockClear();
    const response = await fetch(`${baseUrl}/api/auth/__test-error`);

    expect(response.status).toBe(500);
    const body = await response.text();
    expect(JSON.parse(body)).toMatchObject({
      success: false,
      message: 'Internal server error',
    });
    expect(body).not.toContain('sensitive upstream detail');
    expect(mockRequestLog.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http.request.error',
        method: 'GET',
        path: '/api/auth/__test-error',
        statusCode: 500,
      }),
      'API request failed',
    );
  });

  it('blocks direct Better Auth user-management mutations', async () => {
    mockRequestLog.warn.mockClear();
    for (const path of [
      '/api/auth/admin/set-role',
      '/api/auth/admin/set-user-password',
    ]) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId: 'target', role: 'superadmin' }),
      });

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toMatchObject({
        success: false,
        message:
          'Use the protected staff management workflow for this operation',
      });
    }

    expect(mockRequestLog.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http.request.error',
        method: 'POST',
        path: '/api/auth/admin/set-role',
        statusCode: 403,
      }),
      'API request rejected',
    );
  });

  it('exposes a public storefront namespace', async () => {
    const response = await fetch(`${baseUrl}/api/storefront/health`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('keeps staff invitation acceptance outside the protected admin namespace', async () => {
    const response = await fetch(`${baseUrl}/api/staff-invitations/accept`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
    });
  });

  it('reports invitation link opens without exposing or requiring a token', async () => {
    const response = await fetch(`${baseUrl}/api/staff-invitations/open`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'missing' });
  });

  it('logs admin API access without query strings', async () => {
    mockRequestLog.info.mockClear();

    const response = await fetch(
      `${baseUrl}/api/admin/me?token=must-not-be-logged`,
    );

    expect(response.status).toBe(200);
    expect(mockRequestLog.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http.request.completed',
        scope: 'staff',
        method: 'GET',
        path: '/api/admin/me',
        statusCode: 200,
      }),
      'API request completed',
    );
    expect(JSON.stringify(mockRequestLog.info.mock.calls)).not.toContain(
      'must-not-be-logged',
    );
  });
});
