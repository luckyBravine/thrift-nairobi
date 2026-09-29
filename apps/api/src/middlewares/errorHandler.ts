import type {Request, Response, NextFunction} from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';


export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void{
    if(err instanceof AppError){
        req.log?.warn({err, details: err.details}, err.message);
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details ?? undefined,
            requestId: req.requestId,
        });

        return
    };

    logger.error({err, requestId: req.requestId}, "Unhandled error");

    res.status(500).json({
        success: false,
        message: "Internal server error",
        requestId: req.requestId,
    });
};