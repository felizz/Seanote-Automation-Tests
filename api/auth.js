/**
 * Created by kyle on 11/3/16.
 */

var expect = require('chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');

describe("Authentication - Login", function () {

    it("should return Success if user exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: '123qwe' },
            function reqCallback(code, data){
                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                logger.info(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });

    it("should return failure if password is incorrect", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: 'incorrect' },
            function reqCallback(code, data){
                expect(code).to.equal(returnCode.AUTHENTICATION_ERROR.code);
                logger.info(JSON.stringify(data));
                done();
            }
        );
    });

    it("should return failure if username does not exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz123', password: '123qwe' },
            function reqCallback(code, data){
                expect(code).to.equal(returnCode.DOES_NOT_EXIST.code);
                logger.info(JSON.stringify(data));
                done();
            }
        );
    });
});

describe("Authentication - Logout", function () {

    it("should return Success ", function (done) {
        request.get('/v1/authentication/logout',
            function reqCallback(code, data){
                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                logger.info(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });
});