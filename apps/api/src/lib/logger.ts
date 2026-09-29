import  pino, { type LoggerOptions } from "pino";
import {env, isDevelopment } from '../config/env';

const baseOptions: LoggerOptions = {
    level: env.LOG_LEVEL,
    base: {
        service: 'thrift-api',
        env: env.NODE_ENV,
    },
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level(label){
            return {level: label};
        },
    },
};


export const logger = pino(
    baseOptions,
    isDevelopment
    ? pino.transport({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid, hostname',
        },
    })
    : undefined,
    // pino.transport({
    //     targets: [
    //         {target: 'pino/file', options: {destination: 1}},
    //         {
    //             target: 'pino-eslaticsearch',
    //             options: {
    //                 index: 'thrift-api',
    //                 node: process.env.ELAST
    //             }
    //         }
    //     ]
    // })
);

export function createRequestLogger(requestId: string){
    return logger.child({requestId});
};
