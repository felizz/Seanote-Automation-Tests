/**
 * Created by kyle on 14/3/16.
 */
var creatorCodeObj = function (data) {
    var codeObj = {
        code: data.code,
        info: function(retMsg){
            if(retMsg){
                codeObj.msg = retMsg;
            }

            return codeObj;
        },
        msg: data.msg
    }

    return codeObj;
};

var codes = {
    INTERNAL_SERVER_ERROR: creatorCodeObj({
        code:'INTERNAL_SERVER_ERROR',
        msg:'Server error'}),

    BAD_REQUEST: creatorCodeObj({
        code:'BAD_REQUEST',
        msg:'Bad request'
    }),

    DATABASE_ERROR: creatorCodeObj({
        code:'DATABASE_ERROR',
        msg:'Database error'}),

    INPUT_PARAMETERS_INVALID: creatorCodeObj({
        code:'INPUT_PARAMETERS_INVALID',
        msg:'Input parameters are invalid'}),

    OBJECT_NOT_FOUND: creatorCodeObj({
        code: 'OBJECT_NOT_FOUND',
        msg: 'Object not found'
    }),

    REQUEST_SUCCESS: creatorCodeObj({
        code: 'REQUEST_SUCCESS',
        msg: 'Request successful'
    }),

    AUTHENTICATION_ERROR: creatorCodeObj({
        code: 'AUTHENTICATION_ERROR',
        msg: 'Authentication error'
    }),

    ALREADY_EXIST: creatorCodeObj({
        code: 'ALREADY_EXIST',
        msg: 'Object already exist'
    }),

    DOES_NOT_EXIST: creatorCodeObj({
        code: 'DOES_NOT_EXIST',
        msg: 'Object is not exist'
    }),

    UNAUTHORIZED: creatorCodeObj({
        code: 'UNAUTHORIZED',
        msg: 'Unauthorized Operation'
    })

};

module.exports = codes;