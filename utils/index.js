/**
 * Created by kyle on 11/3/16.
 */

var COOKIE  = null;
var request = require("request");
var Ajv = require('ajv');
var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
var expect = require('Chai').expect;


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


module.exports = {

    get: function (url, callback) {
        var options = { method: 'GET',
            url: url,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json' },
            json: true };

        request(options, function (error, response, body) {
            expect(error).to.not.exist;
            var validResponse = ajv.validate(schema, body);
            if(!validResponse){
                console.log("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }

            callback(body.code, body.msg);
        });
    },

    post : function (url, reqBody, callback){

        var options = { method: 'POST',
            url: url,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json' },
            body: reqBody,
            json: true };

        request(options, function (error, response, body) {
            expect(error).to.not.exist;
            var validResponse = ajv.validate(schema, body);
            if(!validResponse){
                console.log("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }

            callback(body.code, body.msg);
        });
    }
};