
const expect = require('chai').expect;
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.use(require('chai-http'));
chai.use(require('chai-json'));
const app = require('../app');
const request = chai.request.agent(app);
let eventId, promocode, promocodeId

describe('Promocode API', function () {

    before((done) => {
        request.post('/events/create')
            .set('Accept', 'application/json')
            .send({
                "name": "Texas Base Ball",
                "date": "2019-01-17T00:00:00Z",
                "location": [1.340, 36.639]
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('insertedIds')
                expect(response.body.data).to.have.property('result')
                expect(response.body.data.result).to.have.property('ok')
                expect(response.body.data.result.ok).to.eql(1)
                expect(typeof response.body.data.insertedIds[0]).to.eql('string')
                eventId = response.body.data.insertedIds[0];
                done();
            });

    });

    it('Should fail create promo code >> Event not existing', function (done) {
        request.post('/promocode/generate')
            .set('Accept', 'application/json')
            .send({
                "eventId": "5c4089ead2a25913f048d73a",
                "value": 500,
                "expiryDate": "2019-01-19T00:00:00Z",
                "radius": 500
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(400);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.have.property('message')
                expect(response.body.error.message).to.eql('event not found')
                done();
            });
    })

    it('Should fail create promo code >> Missing some fields', function (done) {
        request.post('/promocode/generate')
            .set('Accept', 'application/json')
            .send({
                "eventId": "5c4089ead2a25913f048d73a",
                "value": 500,
                "expiryDate": "2019-01-19T00:00:00Z",
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(400);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.have.property('message')
                expect(response.body.error.message).to.eql('please check your body')
                done();
            });
    })


    it('Should create promo code', function (done) {
        request.post('/promocode/generate')
            .set('Accept', 'application/json')
            .send({
                eventId,
                "value": 500,
                "expiryDate": "2019-01-19T00:00:00Z",
                "radius": 500   
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.be.an('object');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code).to.have.property('ops')
                expect(response.body.data.code.ops[0].eventId).to.eql(eventId)
                promocode = response.body.data.code.ops[0].code
                promocodeId = response.body.data.code.ops[0]._id
                done();
            });
    })

    it('Should deactivate promocode using code', function (done) {
        request.patch(`/promocode/${promocode}/deactivate`)
            .set('Accept', 'application/json')
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code.nModified).to.eql(1);
                done();
            });
    })

    it('Should activate promocode using code', function (done) {
        request.patch(`/promocode/${promocode}/activate`)
            .set('Accept', 'application/json')
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code.nModified).to.eql(1);
                done();
            });
    })

    it('Should deactivate promocode using codeid', function (done) {
        request.patch(`/promocode/${promocodeId}/deactivate`)
            .set('Accept', 'application/json')
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code.nModified).to.eql(1);
                done();
            });
    })

    it('Should activate promocode using codeid', function (done) {
        request.patch(`/promocode/${promocodeId}/activate`)
            .set('Accept', 'application/json')
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code.nModified).to.eql(1);
                done();
            });
    })

    it('Should validate promo code', function (done) {
        request.post('/promocode/validate')
            .set('Accept', 'application/json')
            .send({
                "origin":[2.3956,32.4693],
                "destination":[2.3956,32.9693],
                "code": promocode
            })
            .end((error, response) => {
                if (error) throw error;
                expect('Content-Type', /json/);
                expect(response).to.have.status(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.be.an('object');
                expect(response.body.data).to.have.property('code');
                expect(response.body.data.code).to.be.an('object');
                expect(response.body.data.code.eventId).to.eql(eventId);
                expect(response.body.data.polyline).to.eql('o{rMctdeE?_t`B');
                done();
            });
    })

});