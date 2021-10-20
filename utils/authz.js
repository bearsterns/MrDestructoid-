// Checks if the user (chatter) is whitelisted to use some specific commands.
module.exports.isOwner = function isOwner(context, request, callback) {
    const userCommand = request[0].substring(process.env.PREFIX.length);
    const commandsWhitelist = JSON.parse(process.env.commandsWhitelist);
    const whitelistedCommands = commandsWhitelist[context["user-id"]];

    if (
        (!whitelistedCommands || !whitelistedCommands.includes(userCommand))
        && (context["user-id"] !== process.env.ADMIN)
    ) {
        return {
            message: `@${context.username}, ${process.env.IS_WHITELIST}`,
            status: false
        };
    }

    return callback(context, request);
};