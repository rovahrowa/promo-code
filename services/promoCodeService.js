const db =  require('../db/main');
const randomCode = require('../tools/randomCode');
const {ObjectID} = require('mongodb')
const {signCode} = require('../tools/authCript')

module.exports = {
    generate: async (eventId, value, expiryInHours)=>{
        if(!eventId) throw {message: 'please provide an event id', code: 400}
        const event = await db.cols.events.findOne({_id: ObjectID(eventId)});
        if(!event) throw {message: 'event not found', code: 400}   
        
        const code = {eventId, value, code: randomCode(100000, 999999) }
        const status = await db.cols.codes.insert({...code, signature: signCode(code, expiryInHours), active: true})
        return status
    },
    deactivateById: async (id)=>{
        const status = await db.cols.codes.updateOne({_id: ObjectID(id)}, {$set: {active: false}})
        return status;
    },
    deactivateByCode: async (code)=>{
        const status = await db.cols.codes.updateOne({code: parseInt(code)}, {$set: {active: false}})
        return status;
    },
    activateById: async (id)=>{
        const status = await db.cols.codes.updateOne({_id: ObjectID(id)}, {$set: {active: true}})
        return status;
    },
    activateByCode: async (code)=>{
        const status = await db.cols.codes.updateOne({code: parseInt(code)}, {$set: {active: true}})
        return status;
    },
    getActive: async ()=>{
        const status = await db.cols.codes.find({active: true}).toArray()
        return status;
    },
    getAll: async ()=>{
        const status = await db.cols.codes.find({}).toArray()
        return status;
    }
}