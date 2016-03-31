/**
 * Created by kyle on 11/3/16.
 */

var COOKIE_SESSION  = null;
var request = require("request");
var Ajv = require('ajv');
var ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
var logger = require('./logger');
var statusCodes = require('./status-codes');

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

var errorSchema = {
    "properties": {
        "error_name": {
            "type": "string"
        },
        "error_message": {
            "type": "string"
        },
        "status_code": {
            "type": "integer"
        },
        "errors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "field": {
                        "type": "string"
                    },
                    "reason": {
                        "type": "string"
                    }
                },
                "required": ["field", "reason"]

            }
        }
    },
    "required": [ "error_name", "error_message", "status_code"]
};

var END_POINT = 'http://localhost:3000';


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
                logger.info("Error during HTTP Request: " + JSON.stringify(error));
                throw new Error(error);
            }
            logger.debug('GET : ' + url );

            if(response.statusCode === statusCodes.OK || response.statusCode === statusCodes.CREATED || response.statusCode === statusCodes.NO_CONTENT){
                callback(null, body);
            }
            else if(ajv.validate(errorSchema, body)){
                callback(body);
            }
            else {
                logger.info("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }

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

            if(error){
                logger.info("Error during HTTP Request: " + JSON.stringify(error));
                throw new Error(error);
            }

            if(response.headers["set-cookie"]){
                COOKIE_SESSION = response.headers["set-cookie"];
            }

            logger.debug('POST : ' + url );

            if(response.statusCode === statusCodes.OK || response.statusCode === statusCodes.CREATED || response.statusCode === statusCodes.NO_CONTENT){
                callback(null, body);
            }
            else if(ajv.validate(errorSchema, body)){
                callback(body);
            }
            else {
                logger.info("Invalid Response: " + JSON.stringify(body));
                throw new Error("Invalid Response");
            }
        });
    }
};