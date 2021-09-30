// Checks if the user (chatter) is the owner.
// TODO: Privilege system list of user(chatters) instead of just an owner.
module.exports.isOwner = function isOwner(context, request, callback) {
    if (context.username !== process.env.OWNER) {
        return { message: process.env.IS_OWNER, status: false};
    }

    return callback(context, request);
};