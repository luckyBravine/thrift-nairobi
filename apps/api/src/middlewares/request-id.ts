import { randomUUID } from "crypto";
import type {Request, Response, NextFunction} from 'express';
import { createRequestLogger } from "../lib/logger";


export function requestIdMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();

    req.requestId = requestId;
    req.log = createRequestLogger(requestId);

    res.setHeader('x-request-id', requestId);

    next();
}