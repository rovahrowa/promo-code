const express = require('express');
const logger = require('../tools/logger');
const eventService = require('../services/eventsService')

const router = express();

router.post('/create', async (req, res) => {
    try {
        const event = req.body;
        if(!event.name || !event.location || !event.date) throw {message: 'invalid event data please check schema', code: 400 }
        const status = await eventService.create(event);
        res.send({ data: status })
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})

module.exports = router;