import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';
import { AppError } from '../errors/AppError';

declare module 'express-serve-static-core' {
  interface Request {
    session?: Awaited<ReturnType<typeof auth.api.getSession>>;
  }
}

export async function requireSession(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      query: { disableCookieCache: true },
    });
    if (!session) throw new AppError(401, 'Unauthorized');
    req.session = session;
    next();
  } catch (e) {
    next(e);
  }
}

export function requireRole(roles: readonly string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = (req.session?.user as { role?: string | string[] } | undefined)
      ?.role;
    const userRoles = Array.isArray(role)
      ? role
      : typeof role === 'string'
        ? role.split(',').map((entry) => entry.trim())
        : [];
    if (!roles.some((allowed) => userRoles.includes(allowed))) {
      return next(new AppError(403, 'Forbidden'));
    }
    next();
  };
}
