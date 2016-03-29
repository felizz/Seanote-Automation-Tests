/**
 * Created by kyle on 22/1/16.
 * Contain constants and function to validate data basing on the constants.
 */
module.exports = {
    //enumeration for vote action (because client send us downvote/upvote but we want to store them as integer)
    //FIXME - constants should be named in capital.
    VOTE_ACTION_MAP:{
        downvote: 0,
        upvote: 1,
        clear: 2
    },

    //FIXME - it should be changed to RELATION_TYPE: {USER_USER:0, USER_POST:1}
    //FIXME - we shouldn't use LIMIT as a way to check valid TYPE. When needed, a switch & default should be used instead.
    FOLLOW_TYPE:{
        USER_FOLLOW_USER: 0,
        USER_FOLLOW_POST: 1,
        LIMIT: 2
    },

    //FIXME - we shouldn't use LIMIT as a way to check valid ACTION. When needed, a switch & default should be used instead.
    FOLLOW_ACTION:{
        FOLLOWING: 0,
        UNFOLLOWING: 1,
        LIMIT: 2
    },

    UI_DATA_MODEL: {
        USER: "user",
        TARGET_USER: "target_user",
        POST: "post",
        FOLLOWER: "follower_users",
        FOLLOWING: "following_users",
        COUNTER: "counters",
        FOLLOW_REL: "following_rel"
    },

    POST_TYPE:{
        QUESTION: 0,
        NOTE: 1,
        SHARING: 2,
        LIMIT: 3
    },

    ACTIVITY_TYPE:{
        CREATE_NEW_POST: 0,
        COMMENT_ON_POST: 1,
        UPVOTE_ON_POST: 2,
        DOWNVOTE_ON_POST: 3,
        FOLLOW_POST: 4,
        FOLLOW_USER: 5,
        SHARE_POST: 6,
        LIMIT: 7
    },

    ACTIVITY_MAX_SCORE: Number.MAX_VALUE,

    ACTIVITY_MIN_SCORE: 0,

    /**
     * FIXME - Added comment to explain about what each event means?
     */
    WEB_SOCKET:{
        EVENTS:{
            GET_ALL_COMMENTS: 'GET_ALL_COMMENTS',
            RECEIVE_NEW_COMMENT: 'RECEIVE_NEW_COMMENT',
            UPDATE_VOTE_COUNTERS: 'UPDATE_VOTE_COUNTERS',
            UPDATE_SHARING_COUNTERS: 'UPDATE_SHARING_COUNTERS',
            FEED: 'feed',
            UPDATE: 'update',
            DO_VOTE: 'do-vote',
            DO_SHARE: 'do-share',
            NEW_COMMENT: 'new-comment',
            JOIN_POST_ROOM: 'join-post-room',
            LEAVE_POST_ROOM: 'leave-post-room'
        },
        CHANNELS: {
            NEWSFEED_UPDATE_CHANNEL:    '/newsfeed-update-channel',
            POST_UPDATE_CHANNEL:        '/post-update-channel'
        }
    },

    /**
     * Use the same emitting mechanism as Flux Store.
     */
    INTERNAL_EVENTS: {
        SHARING_COMPLETE: 'sharing-complete',
        OPEN_SHARE_MODEL: 'open_share_modal',
        NEWSFEED_EXCLUDE_ACTIVITY: 'newsfeed_exclude_activity'
    }
}
