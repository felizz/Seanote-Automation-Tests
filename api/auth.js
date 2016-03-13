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
        testUtils.post('http://dev.seanote.com:3000/v1/authentication/login',  { username: 'felizz', password: '123qwe' },
            function reqCallback(returnCode, data){
                console.log(JSON.stringify(returnCode));
                console.log(JSON.stringify(data));
                expect(data.user_id).to.be.a('string');
                done();
            }
        );
    });
});