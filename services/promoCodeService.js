const db = require('../db/main');
const randomCode = require('../tools/randomCode');
const { ObjectID } = require('mongodb')
const { isCodeActive, signCode } = require('../tools/authCrypt');
const getRadiusBetween = require('../tools/getRadiusBetween')
const generatePolyline = require('../tools/generatePolyLine');

module.exports = {
    generate: async (eventId, value, expiryInHours, radius) => {
        if (!eventId) throw { message: 'please provide an event id', code: 400 };
        const event = await db.cols.events.findOne({ _id: ObjectID(eventId) });
        if (!event) throw { message: 'event not found', code: 400 };
        const code = { eventId, value, code: randomCode(100000, 999999), radius };
        const status = await db.cols.codes.insert({ ...code, signature: signCode(code, expiryInHours), active: true });
        return status;
    },
    deactivateById: async (id) => {
        const status = await db.cols.codes.updateOne({ _id: ObjectID(id) }, { $set: { active: false } });
        return status;
    },
    deactivateByCode: async (code) => {
        const status = await db.cols.codes.updateOne({ code: parseInt(code) }, { $set: { active: false } });
        return status;
    },
    activateById: async (id) => {
        const status = await db.cols.codes.updateOne({ _id: ObjectID(id) }, { $set: { active: true } });
        return status;
    },
    activateByCode: async (code) => {
        const status = await db.cols.codes.updateOne({ code: parseInt(code) }, { $set: { active: true } });
        return status;
    },
    getActive: async () => {
        const codes = await db.cols.codes.find({ active: true }).toArray();
        const notExpired = [];
        for (const code of codes) {
            const valid = await isCodeActive(code.signature);
            if (valid) notExpired.push(code);
        }
        return notExpired;
    },
    getAll: async () => {
        const status = await db.cols.codes.find({}).toArray();
        return status;
    },
    validate: async (code, origin, destination) => {
        const _code = await db.cols.codes.findOne({ code: parseInt(code) });
        if (!_code) throw { message: 'invalid code', code: 400 };
        const radius = getRadiusBetween(origin[0], origin[1], destination[0], destination[1])
        if (radius > _code.radius) throw { message: `this code can only be used within ${_code.radius} kms from the location of event location, you are ${parseInt(radius - _code.radius)} km away`, code: 400 };
        return {code: _code, polyline: generatePolyline(origin, destination)};
    }
}