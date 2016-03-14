/**
 * Created by kyle on 11/3/16.
 */

var expect = require('Chai').expect;
var request = require('../lib/request');
var testUtils = require('../lib/utils');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');


describe("User - Singup", function () {

    beforeEach(function() {
        var uuid = require('node-uuid');
        var randomString = uuid.v1().replace(/-/g, "");
        username = "bot_"+ randomString;
        logger.info("Username created - " + username);
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
            function reqCallback(code, data) {
                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                logger.info(JSON.stringify(data));
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
                function reqCallback(code, data) {
                    expect(code).to.equal(returnCode.UNAUTHORIZED.code);
                    logger.info(JSON.stringify(data));
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
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));
                    done();
                }
            );
        });
    });


    it(" allow user to get basic info of other users ", function (done) {

        var FELIZZ_USER_ID = '24381785672515584';

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){

            request.get('/v1/user/'+ FELIZZ_USER_ID + '/info',
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));
                    done();
                }
            );
        });
    });

});


describe("User - UpdateUserInfo", function () {

    it("should return basic info when user logged in ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){

            var reqData = {
                first_name: "Testing",
                gender: "m",
                birthday: {
                    day: 11,
                    month: 11,
                    year:1991
                }
            };

            request.post('/v1/user/'+ user.id + '/info/update', reqData,
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));

                    //Assess if user data is updated
                    request.get('/v1/user/'+ user.id + '/info',
                        function reqCallback(code, userData){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            logger.info(JSON.stringify(userData));
                            expect(userData.first_name).to.equal(reqData.first_name);
                            expect(userData.gender).to.equal(reqData.gender);
                            expect(userData.birthday.day).to.equal(reqData.birthday.day);
                            expect(userData.birthday.month).to.equal(reqData.birthday.month);
                            expect(userData.birthday.year).to.equal(reqData.birthday.year);
                            done();
                        }
                    );
                }
            );
        });
    });
});
