const db =  require('../db/main');

module.exports = {
    create: async (data)=>{
        const event = await db.cols.events.insert(JSON.parse(JSON.stringify(data)))
        return event;
    }
}