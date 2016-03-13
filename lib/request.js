/**
 * Created by kyle on 11/3/16.
 */

var COOKIE_SESSION  = null;
var request = require("request");
var Ajv = require('ajv');
var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}


var schema = {
    "properties": {
        "code": {
            "type": "string"
        },
        "msg": {
        }
    },
    "required": [ "code", "msg"]
};

var END_POINT = 'http://dev.seanote.com:3000';


module.exports = {
    clearCookie: function (){
        COOKIE_SESSION = null;
    },

    get: function (url, callback) {
        var options = { method: 'GET',
            url: END_POINT + url,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            json: true
        };

        if(COOKIE_SESSION){
            options.headers['cookie'] = COOKIE_SESSION;
        }

        request(options, function (error, response, body) {
            if(error){
                console.log("Error during HTTP Request: " + JSON.stringify(error));
                throw new Error(error);
            }
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
            url: END_POINT + url,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: reqBody,
            json: true
        };

        if(COOKIE_SESSION){
            options.headers['cookie'] = COOKIE_SESSION;
        }

        request(options, function (error, response, body) {

            if(response.headers["set-cookie"]){
                COOKIE_SESSION = response.headers["set-cookie"];
            }

            if(error){
                console.log("Error during HTTP Request: " + JSON.stringify(error));
                throw new Error(error);
            }
            var validResponse = ajv.validate(schema, body);
            if(!validResponse){
                console.log("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }

            callback(body.code, body.msg);
        });
    }
};