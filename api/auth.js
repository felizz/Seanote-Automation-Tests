/**
 * Created by kyle on 11/3/16.
 */

var expect = require('Chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');

describe("Authentication - Login", function () {

    it("should return Success if user exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: '123qwe' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                logger.info(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });

    it("should return failure if password is incorrect", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz', password: 'incorrect' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('AUTHENTICATION_ERROR');
                logger.info(JSON.stringify(data));
                done();
            }
        );
    });

    it("should return failure if username does not exists", function (done) {
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: 'felizz123', password: '123qwe' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('DOES_NOT_EXIST');
                logger.info(JSON.stringify(data));
                done();
            }
        );
    });
});

describe("Authentication - Logout", function () {

    it("should return Success ", function (done) {
        request.get('/v1/authentication/logout',
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                logger.info(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });
});