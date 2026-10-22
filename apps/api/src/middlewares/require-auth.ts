import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';
import { AppError } from '../errors/AppError';
import type { StaffRole } from '../auth/permissions';

declare module 'express-serve-static-core' {
  interface Request {
    session?: Awaited<ReturnType<typeof auth.api.getSession>>;
  }
}

export async function requireSession(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) throw new AppError(401, 'Unauthorized');
    req.session = session;
    next();
  } catch (e) {
    next(e instanceof AppError ? e : new AppError(401, 'Unauthorized'));
  }
}

export function requireRole(roles: StaffRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.session?.user?.role as string | undefined;
    if (!role || !roles.includes(role as StaffRole)) {
      return next(new AppError(403, 'Forbidden'));
    }
    next();
  };
}