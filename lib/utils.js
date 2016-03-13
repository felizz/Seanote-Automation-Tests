/**
 * Created by kyle on 14/3/16.
 */

var request = require('../lib/request');
var expect = require('Chai').expect;



var utils = {
    login : function (username, password, callback){
        request.clearCookie();
        request.post('/v1/authentication/login',  { username: username, password: password },
            function reqCallback(returnCode, data){
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                console.log("Loged In : " + username);
                callback(data.user_id);
            }
        );
    },

    signupRandomUserThenLogIn : function (callback) {
        var uuid = require('node-uuid');
        var randomString = uuid.v1().replace(/-/g, "");
        var username = "bot_"+ randomString;
        var password = "123qwe";

        request.clearCookie();
        request.post('/v1/user/signup',
            {
                email: username + "@felizz.com",
                username: username,
                first_name: "Test",
                last_name: "Bot",
                password: password,
                confirm_password: password
            },
            function reqCallback(returnCode, data) {
                expect(returnCode).to.equal('REQUEST_SUCCESS');
                console.log("Created bot : " + username);
                utils.login(username, password, function loginCallback(user_id){
                    callback({id : user_id, username: username});
                });
            }
        );
    }
};

module.exports = utils;