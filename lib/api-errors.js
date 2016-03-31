/**
 * Created by kyle on 27/3/16.
 */
var ErrorRes = require('./error-res');
var statusCodes = require('./status-codes');


var createErrorResTemplate = function (data) {
    var template = {
        data: data,

        //Create new error based on this template
        new: function (){
            return new ErrorRes(this.data.error_name, this.data.error_message, this.data.statusCode);
        }
    }

    return template;
};

var errors = {
    INTERNAL_SERVER_ERROR: createErrorResTemplate({
        error_name:'INTERNAL_SERVER_ERROR',
        error_message:'Server Encountered Error',
        statusCode: statusCodes.INTERNAL_SERVER_ERROR
    }),

    INVALID_PARAMETERS: createErrorResTemplate({
        error_name:'INVALID_PARAMETERS',
        error_message:'Some of the input parameters are invalid',
        statusCode: statusCodes.BAD_REQUEST
    }),

    RESOURCE_NOT_FOUND: createErrorResTemplate({
        error_name: 'RESOURCE_NOT_FOUND',
        error_message: 'Resource not found',
        statusCode: statusCodes.NOT_FOUND
    }),

    AUTHENTICATION_ERROR: createErrorResTemplate({
        error_name: 'AUTHENTICATION_ERROR',
        error_message: 'Authentication error',
        statusCode : statusCodes.UNAUTHORIZED
    }),

    ALREADY_EXIST: createErrorResTemplate({
        error_name: 'ALREADY_EXIST',
        error_message: 'Object already exist',
        statusCode: statusCodes.UNPROCESSABLE_ENTITY

    }),

    INSUFFICIENT_PRIVILEGES: createErrorResTemplate({
        error_name: 'INSUFFICIENT_PRIVILEGES',
        error_message: 'Operation Not Allowed',
        statusCode: statusCodes.FORBIDDEN
    })

};

module.exports = errors;