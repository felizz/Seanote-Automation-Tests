/**
 * Created by kyle on 14/3/16.
 */


var expect = require('Chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');
var testUtils = require('../lib/utils');

var reqData = {
    body: "Seanote Rule the world!"
};

var createQuestion = function (callback) {
    request.post('/v1/question/create', reqData,
        function reqCallback(code, data){
            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
            callback(data);
        }
    );
};


describe("Question - Create Question", function () {

    it("should enable logged in user to create question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/question/create', reqData,
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));
                    done();
                }
            );
        });
    });
});

describe("Question - Get Question", function () {

    it("should enable logged in user to create question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.get('/v1/question/' + question.id,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.body).to.equal(reqData.body);
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });
});

