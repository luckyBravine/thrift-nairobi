import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

function getSafeDetails(details: unknown) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return undefined;
  }

  const record = details as Record<string, unknown>;
  const safeDetails: Record<string, string> = {};
  for (const key of ['source', 'code', 'errorName']) {
    const value = record[key];
    if (typeof value === 'string') {
      safeDetails[key] = value;
    }
  }
  return Object.keys(safeDetails).length > 0 ? safeDetails : undefined;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err instanceof Error ? err : new Error(String(err));
  const appError = error instanceof AppError ? error : undefined;
  const statusCode = appError?.statusCode ?? 500;
  const fields = {
    event: 'http.request.error',
    requestId: req.requestId,
    method: req.method,
    path: req.requestPath,
    statusCode,
    errorName: error.name,
    userId: req.session?.user.id,
    role: req.session?.user.role,
    ...(appError ? { details: getSafeDetails(appError.details) } : {}),
  };

  if (statusCode >= 500 || !appError?.isOperational) {
    req.log.error({ ...fields, err: error }, 'API request failed');
  } else {
    req.log.warn({ ...fields, message: error.message }, 'API request rejected');
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(statusCode).json({
    success: false,
    message: appError?.isOperational
      ? appError.message
      : 'Internal server error',
    ...(appError?.isOperational && appError.details !== undefined
      ? { details: appError.details }
      : {}),
    requestId: req.requestId,
  });
};
