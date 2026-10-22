// entry file for express
// has express related logic

import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import { requestIdMiddleware } from './middlewares/request-id';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth/auth';

export function createApp(): express.Express {

    const app = express();

    app.set('trust proxy', 1);
    app.use(helmet());
    // enable cross-origin resource sharing
    app.use(cors({
        origin: true,
        credentials: true
    }));
    
    app.use(requestIdMiddleware);

    app.all('/api/auth/*splat', toNodeHandler(auth))
    
    // parse incoming JSON request bodies
    app.use(express.json({ 
        limit: '1mb'
    }));
    app.use(express.urlencoded({
        extended: true
    }));


    return app;
}


