import type { createRequestLogger } from '../lib/logger';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      requestPath: string;
      log: ReturnType<typeof createRequestLogger>;
    }
  }
}
