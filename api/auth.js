/**
 * Created by kyle on 11/3/16.
 */
/**
 * Created by kyle on 11/3/16.
 */

var request = require('request');


describe("Authentication - Login", function () {
    var loginResponse;

    it("should return Success if user exists", function () {
        var postData = {
            username: "felizz",
            password: "123qwe"
        };

        request.post({url:'http://dev.seanote.com:3000/v1/authentication/login', formData: postData}, function callback(err, httpResponse, body) {
            if (err) {
                return console.error('HTTP Call failed:', err);
            }
            console.log('Upload successful!  Server responded with:', JSON.stringify(body));
        });
    });
});