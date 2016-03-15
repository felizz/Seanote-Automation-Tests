/**
 * Created by kyle on 15/3/16.
 */

/**
 * Created by kyle on 22/1/16.
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
        QUESTION: "question",
        FOLLOWER: "follower_users",
        FOLLOWING: "following_users",
        COUNTER: "counters",
        FOLLOW_REL: "following_rel"
    },
}
