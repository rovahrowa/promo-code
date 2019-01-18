
const expect = require('chai').expect;
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.use(require('chai-http'));
chai.use(require('chai-json'));
const app = require('../app');
const request = chai.request.agent(app);

describe('Events API', function () {

    it('Should fail create event >> Wrong schema', function (done) {
        request.post('/events/create')
            .set('Accept', 'application/json')
            .send({
                "name":"Texas Base Ball",
                "date": "2019-01-17T00:00:00Z",
                
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(400);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.have.property('message')
                expect(response.body.error.message).to.eql('invalid event data please check schema')
                done();
            });
    })

    it('Should create promo code', function (done) {
        request.post('/events/create')
            .set('Accept', 'application/json')
            .send({
                "name":"Texas Base Ball",
                "date": "2019-01-17T00:00:00Z",
                "location":[1.340,36.639]
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('insertedIds')
                expect(response.body.data).to.have.property('result')
                expect(response.body.data.result).to.have.property('ok')
                expect(response.body.data.result.ok).to.eql(1)
                expect(response.body.data.ops[0].name).to.eql('Texas Base Ball')
                expect(typeof response.body.data.insertedIds[0]).to.eql('string')
                done();
            });
    })

});