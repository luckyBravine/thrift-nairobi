import type { Request, RequestHandler, Response } from 'express';
import { auth } from '../auth/auth';
import { db } from '../db/client';
import { AppError } from '../errors/AppError';
import {
  requireAdminRole,
  requireCustomer,
  requireStaff,
} from './require-role';

jest.mock('../auth/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}));

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn(),
}));

jest.mock('../db/client', () => ({
  db: { select: jest.fn() },
}));

const getSession = auth.api.getSession as jest.Mock;
const select = db.select as jest.Mock;

function mockSession(role: string, createdAt = new Date()) {
  getSession.mockResolvedValue({
    user: { id: 'staff-1', role },
    session: { id: 'session-1', createdAt },
  });
}

function mockSessionWithoutRole() {
  getSession.mockResolvedValue({
    user: { id: 'user-without-role' },
    session: { id: 'session-1', createdAt: new Date() },
  });
}

function mockStoredUser(
  twoFactorEnabled: boolean,
  twoFactorEnabledAt: Date | null,
) {
  select.mockReturnValue({
    from: () => ({
      where: () => ({
        limit: async () => [{ twoFactorEnabled, twoFactorEnabledAt }],
      }),
    }),
  });
}

async function invoke(handler: RequestHandler, req: Request): Promise<unknown> {
  return new Promise((resolve) => {
    handler(req, {} as Response, resolve);
  });
}

async function runChain(
  handlers: RequestHandler[],
  req: Request,
): Promise<unknown> {
  for (const handler of handlers) {
    const error = await invoke(handler, req);
    if (error) return error;
  }
  return undefined;
}

function request(role?: string) {
  return {
    headers: {},
    ...(role ? { session: { user: { role } } } : {}),
  } as Request;
}

describe('staff authorization middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects customer accounts from staff routes', async () => {
    mockSession('customer');

    const error = await runChain(requireStaff, request());

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
    expect(select).not.toHaveBeenCalled();
  });

  it('rejects staff sessions without enrolled TOTP', async () => {
    mockSession('support');
    mockStoredUser(false, null);

    const error = await runChain(requireStaff, request());

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
  });

  it('rejects a session created before MFA enrollment', async () => {
    const now = new Date();
    mockSession('admin', now);
    mockStoredUser(true, new Date(now.getTime() + 1000));

    const error = await runChain(requireStaff, request());

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
  });

  it('allows a current staff session with enrolled MFA', async () => {
    const now = new Date();
    mockSession('support', now);
    mockStoredUser(true, new Date(now.getTime() - 1000));

    const error = await runChain(requireStaff, request());

    expect(error).toBeUndefined();
  });

  it('allows customer routes only for customer accounts', async () => {
    mockSession('customer');
    expect(await runChain(requireCustomer, request())).toBeUndefined();

    mockSession('support');
    const error = await runChain(requireCustomer, request());
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
  });

  it('fails closed when the session has no recognized role', async () => {
    mockSessionWithoutRole();

    const error = await runChain(requireCustomer, request());

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
  });

  it('restricts admin-only resources to admin and owner roles', async () => {
    let error = await runChain(requireAdminRole, request('support'));
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);

    error = await runChain(requireAdminRole, request('admin'));
    expect(error).toBeUndefined();
  });
});
