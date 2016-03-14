/**
 * Created by kyle on 14/3/16.
 */


var expect = require('Chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');
var testUtils = require('../lib/utils');

var questionData = {
    body: "Seanote Rule the world!"
};
var commentData = {
    body: "Yeah, we rule the world!"
};

var createQuestion = function (callback) {
    request.post('/v1/question/create', questionData,
        function reqCallback(code, data){
            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
            callback(data);
        }
    );
};


describe("Question - Create Question", function () {

    it("should enable logged in user to create question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/question/create', questionData,
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

    it("should enable logged in to get question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.get('/v1/question/' + question.id,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.body).to.equal(questionData.body);
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });

    it("should enable other user to get question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){
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
});

describe("Question - Edit Question", function () {
    var updateQuestionData = {
        body: "Updated Question"
    };
    it("should enable logged in to edit his question ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){

                request.post('/v1/question/' + question.id + '/update', updateQuestionData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        logger.info(JSON.stringify(data));

                        //Verify if the question is updated
                        request.get('/v1/question/' + question.id,
                            function reqCallback(code, data){
                                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                expect(data.body).to.equal(updateQuestionData.body);
                                done();
                            }
                        );
                    }
                );
            });
        });
    });

    it("should not allow an user to change other people question ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){

                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){
                    request.post('/v1/question/' + question.id + '/update', updateQuestionData,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            logger.info(JSON.stringify(data));

                            //Verify if the question is updated
                            request.get('/v1/question/' + question.id,
                                function reqCallback(code, data){
                                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                    expect(data.body).to.equal(questionData.body);
                                    done();
                                }
                            );
                        }
                    );
                });
            });
        });
    });
});


describe("Question - Get All Question By User", function () {

    it("should enable logged in user to get all question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.get('/v1/question/all',
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.length).to.equal(1); // This user have only one question, which was just created
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });
});


describe("Question - Voting", function () {

    it("should enable logged in user to upvote his question and clear his vote ", function (done) {

        var voteData = {
            action: "upvote"
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.post('/v1/question/' + question.id + '/vote', voteData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        logger.info(JSON.stringify(data));

                        //Clearing Vote
                        request.post('/v1/question/' + question.id + '/vote', {
                            action: "clear"
                        },
                            function reqCallback(code, data){
                                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                logger.info(JSON.stringify(data));
                                done();
                            }
                        );
                    }
                );
            });
        });
    });


    it("should enable logged in user to downvote other user's question ", function (done) {

        var voteData = {
            action: "downvote"
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(newUser){
                    request.post('/v1/question/' + question.id + '/vote', voteData,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                });
            });
        });
    });
});



describe("Question - Create Comment", function () {

    it("should enable logged in user to create comment on his question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                var commentData = {
                    body: "Yeah, we rule the world!"
                };
                request.post('/v1/question/' + question.id + '/comment/create', commentData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.body).to.equal(commentData.body);
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });


    it("should enable logged in user to create comment on other person question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){

                    request.post('/v1/question/' + question.id + '/comment/create', commentData,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            expect(data.body).to.equal(commentData.body);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                });
            });
        });
    });
});


describe("Question - Get Comments By Question", function () {

    it("should enable logged in user to get comment on his question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createQuestion(function createQuestionCallback(question){
                //Create Comment
                request.post('/v1/question/' + question.id + '/comment/create', commentData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        request.get('/v1/question/' + question.id + '/comment/all',
                            function reqCallback(code, data){
                                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                expect(data.length).to.equal(1);
                                logger.info(JSON.stringify(data));
                                done();
                            }
                        );
                    }
                );
            });
        });
    });
});





