const express = require('express');
const setCORS = require('./middlewares/cors');
const logger = require('./tools/logger');

const app = express();

const promcodeAPI = require('./api/promocode')
const eventAPI = require('./api/events');

app.use(setCORS);

app.use(express.json());

app.use('/promocode', promcodeAPI);
app.use('/events', eventAPI);
app.use('*', (req,res)=>res.send({status: 'Online'}))

app.listen(process.env.PORT || 8090, () => {
    logger.info('App started on http://localhost:8090')
});

module.exports = app;