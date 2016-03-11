/**
 * Created by kyle on 11/3/16.
 */
/**
 * Created by kyle on 11/3/16.
 */

var request = require('request');
var expect = require('Chai').expect;

describe("Authentication - Login", function () {
    var loginResponse;

    it("should return Success if user exists", function (done) {
        var postData = {
            username: "felizz",
            password: "123qwe"
        };

        request.post({
            url:'http://dev.seanote.com:3000/v1/authentication/login',
            headers: {
            'Content-Type': 'application/json'
            },
            formData: {
                username: "felizz",
                password: "123qwe"
            }
        },
            function callback(err, httpResponse, body) {
            if (err) {
                return console.error('HTTP Call failed:', err);
            }
            console.log(' Server responded with:', JSON.stringify(body));
            done();
        });
    });
});