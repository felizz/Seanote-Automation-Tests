/**
 * Created by kyle on 11/3/16.
 */

var expect = require('Chai').expect;
var request = require('../lib/request');
var testUtils = require('../lib/utils');


describe("User - Singup", function () {

    beforeEach(function() {
        function generateUIDNotMoreThan1million() {
            var time = Date.now();
            return ("0000" + (Math.random()*time*Math.pow(36,4) << 0).toString(36)).slice(-4)
        }

        username = "bot_" + generateUIDNotMoreThan1million();
        console.log("Username created - " + username);
    });


    it("should signup if user not logged in ", function (done) {

        request.clearCookie();
        request.post('/v1/user/signup',
            {
                email: username + "@felizz.com",
                username: username,
                first_name: "Super",
                last_name: "Bot",
                password: "123qwe",
                confirm_password: "123qwe"
            },
            function reqCallback(returnCode, data) {
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                console.log(JSON.stringify(data));
                done();
            }
        );
    });

    it("should fail signup if user logged in ", function (done) {

        testUtils.login("felizz", "123qwe", function loginCallback(user_id){
            request.post('/v1/user/signup',
                {
                    email: username + "@felizz.com",
                    username: username,
                    first_name: "Super",
                    last_name: "Bot",
                    password: "123qwe",
                    confirm_password: "123qwe"
                },
                function reqCallback(returnCode, data) {
                    expect(returnCode).to.equal('UNAUTHORIZED');
                    console.log(JSON.stringify(data));
                    done();
                }
            );
        });

    });
});

describe("User - GetBasicInfo", function () {

    it("should return basic info when user logged in ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){

            request.get('/v1/user/'+ user.id + '/info',
                function reqCallback(returnCode, data){
                    expect(returnCode).to.equal('REQUEST_SUCCESS');
                    console.log(JSON.stringify(data));
                    done();
                }
            );
        });
    });
});