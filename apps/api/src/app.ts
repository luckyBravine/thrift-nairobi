import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { requestIdMiddleware } from './middlewares/request-id';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import { auth } from './auth/auth';
import { requireAdmin, requireStaff } from './middlewares/require-role';
import { AppError } from './errors/AppError';
import { adminRouter } from './routes/admin';
import { accountRouter } from './routes/account';
import { staffAuthRouter } from './routes/staff-auth';
import { staffInvitationsRouter } from './routes/staff-invitations';
import { storefrontRouter } from './routes/storefront';

export function createApp(): express.Express {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      // SPA on another origin needs to read JSON from this API.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(requestIdMiddleware);

  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.once('finish', () => {
      const statusCode = res.statusCode;
      const fields = {
        event: 'http.request.completed',
        scope: req.requestPath.startsWith('/api/admin')
          ? 'staff'
          : req.requestPath.startsWith('/api/account')
            ? 'customer'
            : req.requestPath.startsWith('/api/storefront')
              ? 'storefront'
              : req.requestPath.startsWith('/api/staff-auth')
                ? 'staff-auth'
                : req.requestPath.startsWith('/api/staff-invitations')
                  ? 'staff-invitations'
                  : req.requestPath.startsWith('/api/auth')
                    ? 'auth'
                    : 'api',
        method: req.method,
        path: req.requestPath,
        statusCode,
        durationMs: Date.now() - startedAt,
        ...(req.session
          ? {
              userId: req.session.user.id,
              role: req.session.user.role,
            }
          : {}),
      };

      if (statusCode >= 500) {
        req.log.error(fields, 'API request failed');
      } else if (statusCode >= 400) {
        req.log.warn(fields, 'API request rejected');
      } else {
        req.log.info(fields, 'API request completed');
      }
    });

    next();
  });

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.trustedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new AppError(403, 'Origin not allowed'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use('/api/auth/admin', ...requireAdmin);

  app.all(
    [
      '/api/auth/admin/create-user',
      '/api/auth/admin/set-role',
      '/api/auth/admin/set-user-password',
      '/api/auth/admin/update-user',
      '/api/auth/admin/ban-user',
      '/api/auth/admin/unban-user',
      '/api/auth/admin/remove-user',
      '/api/auth/admin/delete-user',
      '/api/auth/admin/impersonate-user',
      '/api/auth/admin/stop-impersonating',
      '/api/auth/admin/revoke-user-session',
      '/api/auth/admin/revoke-user-sessions',
    ],
    (_req, _res, next) => {
      next(
        new AppError(
          403,
          'Use the protected staff management workflow for this operation',
        ),
      );
    },
  );

  // Express 5: `{*splat}` captures nested auth paths (`/sign-in/email`).
  // Must run before express.json() so Better Auth can read the raw body.
  app.all(['/api/auth', '/api/auth/{*splat}'], toNodeHandler(auth));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/storefront', storefrontRouter);
  app.use('/api/staff-auth', staffAuthRouter);
  app.use('/api/staff-invitations', staffInvitationsRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/admin', ...requireStaff, adminRouter);

  app.use(errorHandler);

  return app;
}
