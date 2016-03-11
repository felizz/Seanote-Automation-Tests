/**
 * Created by kyle on 11/3/16.
 */
/**
 * Created by kyle on 11/3/16.
 */

var request = require('request');
var expect = require('Chai').expect;
var Ajv = require('ajv');
var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}

var schema = {
    "properties": {
        "code": {
            "type": "string"
        },
        "msg": {
            "type": "object"
        }
    },
    "required": [ "code", "msg"]
};

describe("Authentication - Login", function () {
    var loginResponse;

    it("should return Success if user exists", function (done) {
        var request = require("request");

        var options = { method: 'POST',
            url: 'http://dev.seanote.com:3000/v1/authentication/login',
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json' },
            body: { username: 'felizz', password: '123qwe' },
            json: true };

        request(options, function (error, response, body) {
            expect(error).to.not.exist;
            var validResponse = ajv.validate(schema, body);
            if(!validResponse){
                console.log("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }

            done();
        });

    });
});