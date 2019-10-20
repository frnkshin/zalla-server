const mongoose = require('mongoose');
const config = require('../src/config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const assert = require('assert');
const should = chai.should();
const data = {
    word: 'apple',
    url: 'https://www.google.com'
};

chai.use(chaiHttp);
let connected;

describe('Mongo', () => {
    before((done) => {
        mongoose.connect(config.DB_URL,{ dbName: 'testDB', useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection
            .once('open', () => {
                connected = true;
                done();
            })
            .on('error', () => {
                connected = false;
                throw new Error("Mongo connection using mongoose failed. Aborting...");
            });
    });
});

describe('API', () => {
    describe('POST /link', () => {
        it('should save model in db', (done) => {
            chai.request(server)
                .post('/api/link')
                .send(data)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    done();
                })
        });

        it('should not add doc with duplicate word', (done) => {
            chai.request(server)
                .post('/api/link')
                .send(data)
                .end((err, res) => {
                    res.status.should.be.eql(500);
                    res.body.should.be.a('object');
                    res.body.success.should.be.eql(false);
                    done();
                })
        });

    });

    describe('GET /links', () => {
        it('should get all links in db', (done) => {
            chai.request(server)
                .get('/api/links')
                .end((err, res) => {
                    res.status.should.be.eql(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                    done();
                })
        });
    });

    describe('GET /link/apple', () => {
        it('should get Link with $word', (done) => {
            chai.request(server)
                .get(`/api/link/${data.word}`)
                .end((err, res) => {
                    res.status.should.be.eql(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.haveOwnProperty('word');
                    res.body.data.should.haveOwnProperty('url');
                    done();
                })
        });
    });

    describe('DELETE /link', () => {
        it('should delete the doc with word', (done) => {
            chai.request(server)
                .delete('/api/link')
                .send({word: data.word})
                .end(async (err, res) => {
                    assert.equal(res.status, 200);
                    res.body.should.be.a('object');
                    assert.equal(res.body.success, true);
                    done();
                })
        });
    });
});
