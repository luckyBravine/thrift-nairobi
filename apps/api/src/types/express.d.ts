import type { createRequestLogger } from '../lib/logger';

declare global {
    namespace Express {
        interface Request {
            requestId: string;
            log: ReturnType<typeof createRequestLogger>;
        }
    }
}