import express from 'express';
import * as utility from './utility';

export const timeoutHandler = (request: express.Request, response: express.Response, next: express.NextFunction) => {

    request.setTimeout(10 * 60 * 1000); // 10 min

    next();

};

export const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    utility.print(`Error\n${error}`);

    response.status(500).end();

};
