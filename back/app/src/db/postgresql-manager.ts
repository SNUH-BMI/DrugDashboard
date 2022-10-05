import pg from 'pg';
import dbConfig from '../../config/db.json';

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

export const run = async (sql: string): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const result = await pgClient.query(sql);
            resolve(result.rows);

        } catch(error) { reject(error); }

    });
};
