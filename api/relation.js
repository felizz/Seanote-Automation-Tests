/**
 * Created by kyle on 15/3/16.
 */

var expect = require('chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');
var testUtils = require('../lib/utils');
var fixture = require('../lib/fixture');
var CONSTANTS = require('../lib/CONSTANTS');


describe("Relation - Follow Act", function () {

    it("should enable an user to follow & unfollow another user ", function (done) {

        var followData = {
            following_id: fixture.USER_FELIZZ.id,
            action: CONSTANTS.FOLLOW_ACTION.FOLLOWING,
            type: CONSTANTS.FOLLOW_TYPE.USER_FOLLOW_USER
        };

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/relation/follow/act', followData,
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));

                    followData.action = CONSTANTS.FOLLOW_ACTION.UNFOLLOWING;
                    request.post('/v1/relation/follow/act', followData,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                }
            );
        });
    });
});

describe("Relation - Following", function () {

    it("should enable an user to retrieve her followings ", function (done) {

        var followData = {
            following_id: fixture.USER_FELIZZ.id,
            action: CONSTANTS.FOLLOW_ACTION.FOLLOWING,
            type: CONSTANTS.FOLLOW_TYPE.USER_FOLLOW_USER
        };

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/relation/follow/act', followData,
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));

                    request.get('/v1/relation/follow/following/all?type=' + CONSTANTS.FOLLOW_TYPE.USER_FOLLOW_USER,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            expect(data.length).to.equal(1); // Felizz is the only user that this account follows
                            expect(data[0].following_id).to.equal(fixture.USER_FELIZZ.id);
                            expect(data[0].followed_id).to.equal(user.id);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                }
            );
        });
    });
});


describe("Relation - Followed", function () {

    it("should enable an user to retrieve her followers ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){

            testUtils.signupRandomUserThenLogIn(function callback(newUser){

                var followData = {
                    following_id: user.id,
                    action: CONSTANTS.FOLLOW_ACTION.FOLLOWING,
                    type: CONSTANTS.FOLLOW_TYPE.USER_FOLLOW_USER
                };

                request.post('/v1/relation/follow/act', followData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        logger.info(JSON.stringify(data));
                        request.get('/v1/relation/follow/followed/all?type=' + CONSTANTS.FOLLOW_TYPE.USER_FOLLOW_USER + '&object_id=' + user.id,
                            function reqCallback(code, data) {
                                logger.info(JSON.stringify(data));

                                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                expect(data.length).to.equal(1); // Felizz is the only user that is following this account
                                expect(data[0].following_id).to.equal(user.id);
                                expect(data[0].followed_id).to.equal(newUser.id);
                                done();
                            }
                        );
                    }
                );
            });
        });
    });
});