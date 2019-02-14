'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Point = mongoose.model('Point');

var credentials,
    token,
    mockup;

describe('Point CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            user_id: 'name',
            total: 0,
            used: 0
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Point get use token', (done) => {
        request(app)
            .get('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Point get by id', function (done) {

        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/points/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.user_id, mockup.user_id);
                        done();
                    });
            });

    });

    it('should be Point post use token', (done) => {
        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.user_id, mockup.user_id);
                done();
            });
    });

    it('should be point put use token', function (done) {

        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    user_id: 'name update'
                }
                request(app)
                    .put('/api/points/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.user_id, update.user_id);
                        done();
                    });
            });

    });

    it('should be point delete use token', function (done) {

        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/points/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be point get not use token', (done) => {
        request(app)
            .get('/api/points')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be point post not use token', function (done) {

        request(app)
            .post('/api/points')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be point put not use token', function (done) {

        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/points/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be point delete not use token', function (done) {

        request(app)
            .post('/api/points')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/points/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('this should get data by user_id', function (done) {

        var user1 = new Point({
            user_id: "DDDDDD",
        })

        var user2 = new Point({
            user_id: "EEEEEE",
            total: 5,
            used: 4
        })

        user2.save(function (err, u2) {
            if (err) {
                return done(err);
            }
            user1.save(function (err, u1) {
                if (err) {
                    return done(err);
                }
                var id = {
                    user_id: "EEEEEE"
                }
                request(app)
                    .post('/api/points-user')
                    .send(id)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data[0].user_id, 'EEEEEE')
                        assert.equal(resp.data[0].total, 5)
                        assert.equal(resp.data[0].used, 4)
                        done();
                    });
            })
        })

    });

    afterEach(function (done) {
        Point.remove().exec(done);
    });

});