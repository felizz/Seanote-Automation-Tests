/**
 * Created by kyle on 14/3/16.
 */


var expect = require('chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var returnCode = require('../lib/return-code');
var testUtils = require('../lib/utils');
var POST_TYPE = require('../lib/CONSTANTS.js').POST_TYPE;

var postData = {
    body: "Seanote Rule the world!",
    type: POST_TYPE.QUESTION
};
var commentData = {
    body: "Yeah, we rule the world!"
};

var createPost = function (callback) {
    request.post('/v1/post/create', postData,
        function reqCallback(code, data){
            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
            callback(data);
        }
    );
};


describe("Post - Create Post", function () {

    it("should enable logged in user to create post ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/post/create', postData,
                function reqCallback(code, data){
                    expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                    logger.info(JSON.stringify(data));
                    done();
                }
            );
        });
    });
});

describe("Post - Share Post", function () {

    it("should enable logged in user to share post of other user ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){

            createPost(function createPostCallback(post){
                //Sign up with another user to share
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){
                    var shareData = {
                        post: {
                            body: "This is amazing!",
                            type: POST_TYPE.SHARING,
                            shared_object_id: post.id
                        }
                    };
                    request.post('/v1/post/create', shareData.post,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            //expect(data.shared_from).to.equal(shareData.post.shared_from);

                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                });
            });
        });
    });
});

describe("Post - Get Post", function () {

    it("should enable logged in to get post ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.get('/v1/post/' + act.object.id,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.body).to.equal(postData.body);
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });

    it("should enable other user to get post ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){
                    request.get('/v1/post/' + act.object.id,
                        function reqCallback(code, data){
                            expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                            expect(data.body).to.equal(postData.body);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                });
            });
        });
    });
});

describe("Post - Edit Post", function () {
    var updatePostData = {
        body: "Updated Post"
    };
    it("should enable logged in to edit his post ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){

                request.post('/v1/post/' + act.object.id + '/update', updatePostData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        logger.info(JSON.stringify(data));

                        //Verify if the post is updated
                        request.get('/v1/post/' + act.object.id,
                            function reqCallback(code, data){
                                expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                                expect(data.body).to.equal(updatePostData.body);
                                done();
                            }
                        );
                    }
                );
            });
        });
    });

    it("should not allow an user to change other people post ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){

                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){
                    request.post('/v1/post/' + act.object.id + '/update', updatePostData,
                        function reqCallback(code, data){
                            expect(code).to.not.equal(returnCode.REQUEST_SUCCESS.code);
                            logger.info(JSON.stringify(data));
                            done();
                        }
                    );
                });
            });
        });
    });
});


describe("Post - Get All Question By User", function () {

    it("should enable logged in user to get all question ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.get('/v1/post/all?type=0',
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        expect(data.length).to.equal(1); // This user have only one post, which was just created
                        logger.info(JSON.stringify(data));
                        done();
                    }
                );
            });
        });
    });
});


describe("Post - Voting", function () {

    it("should enable logged in user to upvote his post and clear his vote ", function (done) {

        var voteData = {
            action: "upvote"
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.post('/v1/post/' + act.object.id + '/vote', voteData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        logger.info(JSON.stringify(data));

                        //Clearing Vote
                        request.post('/v1/post/' + act.object.id + '/vote', {
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


    it("should enable logged in user to downvote other user's post ", function (done) {

        var voteData = {
            action: "downvote"
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(newUser){
                    request.post('/v1/post/' + act.object.id + '/vote', voteData,
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



describe("Post - Create Comment", function () {

    it("should enable logged in user to create comment on his post ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                var commentData = {
                    body: "Yeah, we rule the world!"
                };
                request.post('/v1/post/' + act.object.id + '/comment/create', commentData,
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


    it("should enable logged in user to create comment on other person post ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(user){

                    request.post('/v1/post/' + act.object.id + '/comment/create', commentData,
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


describe("Post - Get Comments By Post", function () {

    it("should enable logged in user to get comment on his post ", function (done) {

        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                //Create Comment
                request.post('/v1/post/' + act.object.id + '/comment/create', commentData,
                    function reqCallback(code, data){
                        expect(code).to.equal(returnCode.REQUEST_SUCCESS.code);
                        request.get('/v1/post/' + act.object.id + '/comment/all',
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





