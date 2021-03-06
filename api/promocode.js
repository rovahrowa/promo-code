const express = require('express');
const promoCodeService = require('../services/promoCodeService')

const router = express();

router.get('/all', async (req, res) => {
    try {
        const codes = await promoCodeService.getAll();
        return res.send({ data: codes })
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})
router.get('/active', async (req, res) => {
    try {
        const codes = await promoCodeService.getActive();
        return res.send({ data: codes })
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})

router.post('/generate', async (req, res) => {
    try {
        const { eventId, value, expiryDate, radius } = req.body;
        if (!eventId || !expiryDate || !value || !radius) throw { message: 'please check your body' }
        if(typeof radius !== 'number') throw {message: 'radius must be a number', code: 400}
        const expiryInHours = Math.abs(new Date() - new Date(expiryDate)) / 36e5;
        const code = await promoCodeService.generate(eventId, value, expiryInHours, radius);
        res.send({ data: { code } })
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})
router.post('/validate', async (req, res) => {
    try {
        const { origin, destination, code } = req.body;
        if(!origin || !destination) throw {message: 'missing origin or destination location data'}
        if(!origin[0] || !destination[0]) throw {message: 'invalid origin or destination location data'}
        const _code = await promoCodeService.validate(code, origin, destination);
        res.send({ data: _code })
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})

router.patch('/:promoCode/deactivate', async (req, res) => {
    try {
        const { promoCode } = req.params;

        if (!new RegExp('^[0-9]+$').test(promoCode)) {
            const code = await promoCodeService.deactivateById(promoCode);
            res.send({ data: { code } })
        } else {
            const code = await promoCodeService.deactivateByCode(promoCode);
            res.send({ data: { code } })
        }
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})

router.patch('/:promoCode/activate', async (req, res) => {
    try {
        const { promoCode } = req.params;

        if (!new RegExp('^[0-9]+$').test(promoCode)) {
            const code = await promoCodeService.activateById(promoCode);
            res.send({ data: { code } })
        } else {
            const code = await promoCodeService.activateByCode(promoCode);
            res.send({ data: { code } })
        }
    } catch (e) {
        res.status(e.code || 400).send({ error: { message: e.message || 'server error!' } })
    }
})

module.exports = router;