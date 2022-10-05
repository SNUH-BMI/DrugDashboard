import express from 'express';
import bodyParser from 'body-parser';
import API from './src/api';
import * as DB from './src/db';
import * as middleware from './src/middleware';
import * as utility from './src/utility';
import pg from 'pg';
import config from './config/config.json';

// postgres
DB.init()
    .then(() => utility.print('Database initialized'))
    .catch(() => utility.print('error'));

// redshift
//DB.tunnel()
//    .then(() => utility.print('Tunnel opened!'))
//    .catch(() => utility.print('Tunnel error!'));

// express app
const app = express();
const port = 8080;

const cors = require('cors');

let corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', config.web_address],
    credentials: true
}

declare global {
    var tableCache: any;
}
globalThis.tableCache = {key:"", data: []};

pg.types.setTypeParser(1082, function(stringValue) {
    return stringValue.slice(0,10);  //1082 for date type
});


// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(middleware.timeoutHandler);
app.use(cors(corsOptions));

// route
app.use('/api', API);

// error handler
app.use(middleware.errorHandler);

app.listen(port, () => utility.print(`Server listening on port ${port}!`));
