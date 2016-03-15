/**
 * Created by kyle on 14/3/16.
 */

var request = require('../lib/request');
var fixture = require('../lib/fixture');
var expect = require('chai').expect;
var logger = require('./logger');



var utils = {
    login : function (username, password, callback){
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: username, password: password },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                logger.info("Loged In : " + username);
                callback(data.user_id);
            }
        );
    },

    signupRandomUserThenLogIn : function (callback) {
        var uuid = require('node-uuid');
        var randomString = uuid.v1().replace(/-/g, "");
        var username = "bot_"+ randomString;

        request.clearCookie();
        request.post('/v1/user/signup',
            {
                email: username + "@felizz.com",
                username: username,
                first_name: "Test",
                last_name: "Bot",
                password: fixture.DEFAULT_PASSWORD,
                confirm_password: fixture.DEFAULT_PASSWORD
            },
            function reqCallback(returnCode, data) {
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                logger.info("Created bot : " + username);
                utils.login(username, fixture.DEFAULT_PASSWORD, function loginCallback(user_id){
                    callback({id : user_id, username: username});
                });
            }
        );
    }
};

module.exports = utils;