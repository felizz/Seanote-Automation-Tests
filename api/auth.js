/**
 * Created by kyle on 11/3/16.
 */

var expect = require('chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var apiErrors = require('../lib/api-errors');

describe("Authentication - Login", function () {

    it("should return Success if user exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: '123qwe' },
            function reqCallback(err, data){
                expect(err).to.be.a('null');
                logger.info(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });

    it("should return failure if password is incorrect", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: 'incorrect' },
            function reqCallback(err, data){
                expect(err.error_name).to.equal(apiErrors.AUTHENTICATION_ERROR.new().error_name);
                logger.info(JSON.stringify(err));
                done();
            }
        );
    });

    it("should return failure if username does not exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz123', password: '123qwe' },
            function reqCallback(err, data){
                expect(err.error_name).to.equal(apiErrors.AUTHENTICATION_ERROR.new().error_name);
                logger.info(JSON.stringify(err));
                done();
            }
        );
    });
});

describe("Authentication - Logout", function () {

    it("should return Success ", function (done) {
        request.get('/v1/authentication/logout',
            function reqCallback(err, data){
                expect(err).to.be.a('null');
                expect(data).to.be.a('undefined');
                logger.info(JSON.stringify(data));
                done();
            }
        );
    });
});