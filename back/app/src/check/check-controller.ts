import express from 'express';
import * as utility from '../utility';
import * as DB from '../db';
import config from '../../config/config.json';

/*
Check backend server.
*/
export const getBackend = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // print log
        utility.print(`GET /check/backend`);

        let num = 0;
        for(let i = 0; i <= 10; i++) num += i;

        if(num === 55) response.json({ healthy: true });
        else response.json({ healthy: false });

    } catch(error) { next(error); }

};

/*
Check database.
*/
export const getDatabase = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // print log
        utility.print(`GET /check/database`);

        const query = await DB.run(`SELECT COUNT(*) FROM ${config.main_schema}.concept;`);
        const result = Number(query[0].count);
        utility.print(String(result));
        if(result > 5000000) response.json({ healthy: true });
        else response.json({ healthy: false });

    } catch(error) { next(error); }

};
