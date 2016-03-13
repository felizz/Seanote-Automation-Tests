/**
 * Created by kyle on 11/3/16.
 */
/**
 * Created by kyle on 11/3/16.
 */

var expect = require('Chai').expect;
var testUtils = require('../utils');

describe("Authentication - Login", function () {

    it("should return Success if user exists", function (done) {
        testUtils.post('/v1/authentication/login',  { username: 'felizz', password: '123qwe' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                console.log(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });

    it("should return failure if password is incorrect", function (done) {
        testUtils.post('/v1/authentication/login',  { username: 'felizz', password: 'incorrect' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('AUTHENTICATION_ERROR');
                console.log(JSON.stringify(data));
                done();
            }
        );
    });

    it("should return failure if username does not exists", function (done) {
        testUtils.post('/v1/authentication/login',  { username: 'felizz123', password: '123qwe' },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('DOES_NOT_EXIST');
                console.log(JSON.stringify(data));
                done();
            }
        );
    });
});

describe("Authentication - Logout", function () {

    it("should return Success ", function (done) {
        testUtils.get('/v1/authentication/logout',
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                console.log(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });
});