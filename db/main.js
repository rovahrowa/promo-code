
const server = require('mongodb');
const mongodb = require('mongodb');
const logger = require('../tools/logger');
const MongoDB = mongodb.Db;
const Server = server.Server;
/*
	ESTABLISH DATABASE CONNECTION
*/
const dbName = process.env.ROUTES_DB_NAME || 'promo-code';
const dbHost = process.env.ROUTES_DB_HOST || 'localhost';
const dbPort = process.env.ROUTES_DB_PORT || 27017;

const db = new MongoDB(dbName, new Server(dbHost, dbPort, { auto_reconnect: true, }), { w: 1 });

db.open((e) => {
    if (e) {
        logger.error(e)
        throw e;
    } else {
        db.collection('code').createIndex({ ttl: 1 }, { expireAfterSeconds: 1.577e+7 }).then(() => {
            logger.info('Created TTL index of 6 months on codes')
        }, (e) => logger.info('TTL index exists on codes'));
        logger.info(`DB Connected to Host ${dbHost}, DB ${dbName}`);
    }
});

const codes = db.collection('codes');
const events = db.collection('events');

module.exports = { cols: { codes, events }, db }
