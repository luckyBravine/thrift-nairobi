import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { createRequestLogger } from '../lib/logger';

const requestIdPattern = /^[a-zA-Z0-9._-]{1,128}$/;

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const suppliedId = req.headers['x-request-id'];
  const requestId =
    typeof suppliedId === 'string' && requestIdPattern.test(suppliedId)
      ? suppliedId
      : randomUUID();

  req.requestId = requestId;
  req.requestPath = req.path;
  req.log = createRequestLogger(requestId);

  res.setHeader('x-request-id', requestId);

  next();
}
