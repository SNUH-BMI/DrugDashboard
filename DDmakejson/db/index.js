import pg from 'pg';
import { createRequire } from 'module';
import * as utility from '../utility.js';

const require = createRequire(import.meta.url);
const dbConfig = require('../config/db.json');

const pgClient = new pg.Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

export const init = async () => {

    await pgClient.connect(err => {
        if(err) console.log(err);
    });

};

export const run = (sql) => {
    //const result = await pgClient.query(sql, (err, res) => {
    //    if(err) return console.error(err.message);
    //    console.log(res);
    //});
    return new Promise(async (resolve, reject) => {
        try{
            const result = await pgClient.query(sql);
            resolve(result);
        } catch(error) {reject(error);}
    });
};

export function run_sync(sql){
    const result = pgClient.query(sql, (err, res) => {
        if(err) return console.error(err.message);
        return res;
    });
    console.log(result);
    return result;
};

