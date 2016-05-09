/**
 * Created by kyle on 14/3/16.
 */


var expect = require('chai').expect;
var request = require('../lib/request');
var logger = require('../lib/logger');
var apiErrors = require('../lib/api-errors');
var testUtils = require('../lib/utils');
var consts = require('../lib/CONSTANTS.js');

var POST_TYPE = consts.POST_TYPE;
var VOTE_ACTION = consts.VOTE_ACTION_MAP;

var postData = {
    body: "Seanote Rule the world!",
    type: POST_TYPE.QUESTION
};
var commentData = {
    body: "Yeah, we rule the world!"
};

var createPost = function (callback) {
    request.post('/v1/post/create', postData,
        function reqCallback(err, data){
            expect(err).to.be.a('null');
            callback(data);
        }
    );
};


describe("Post - Create Post", function () {

    it("should enable logged in user to create post ", function (done) {
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            request.post('/v1/post/create', postData,
                function reqCallback(err, data){
                    expect(err).to.be.a('null');
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
                        function reqCallback(err, data){
                            expect(err).to.be.a('null');

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
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
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
                        function reqCallback(err, data){
                            expect(err).to.be.a('null');
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
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
                        logger.info(JSON.stringify(data));

                        //Verify if the post is updated
                        request.get('/v1/post/' + act.object.id,
                            function reqCallback(err, data){
                                expect(err).to.be.a('null');
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
                        function reqCallback(err, data){
                            expect(err.error_name).to.equal(apiErrors.INTERNAL_SERVER_ERROR.new().error_name);
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
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
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
            action: VOTE_ACTION.upvote
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.post('/v1/post/' + act.object.id + '/vote', voteData,
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
                        logger.info(JSON.stringify(data));

                        //Clearing Vote
                        request.post('/v1/post/' + act.object.id + '/vote', {
                            action: VOTE_ACTION.clear
                        },
                            function reqCallback(err, data){
                                expect(err).to.be.a('null');
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
            action: VOTE_ACTION.downvote
        };
        testUtils.signupRandomUserThenLogIn(function loginCallback(user){
            createPost(function createPostCallback(act){
                request.clearCookie();
                testUtils.signupRandomUserThenLogIn(function callback(newUser){
                    request.post('/v1/post/' + act.object.id + '/vote', voteData,
                        function reqCallback(err, data){
                            expect(err).to.be.a('null');
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
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
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
                        function reqCallback(err, data){
                            expect(err).to.be.a('null');
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
                    function reqCallback(err, data){
                        expect(err).to.be.a('null');
                        request.get('/v1/post/' + act.object.id + '/comment/all',
                            function reqCallback(err, data){
                                expect(err).to.be.a('null');
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





