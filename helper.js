const cmd = require('./commands/main');
const { isOwner } = require('./utils/authz');

module.exports.execCmd = function executeCommand(context, request) {
    if (request[0] === `${process.env.PREFIX}ping`) {

        return cmd.ping();
    }

    if (request[0] === `${process.env.PREFIX}replace`) {

        return isOwner(context, request, cmd.replace);
    }

    if (request[0] === `${process.env.PREFIX}parrot`) {
        const response = isOwner(context, request, cmd.parrot);

        return response;
    }

    if (request[0] === `${process.env.PREFIX}attach`) {
        const response = isOwner(context, request, cmd.attach);

        return response;
    }

    if (request[0] === `${process.env.PREFIX}glue`) {
        const response = isOwner(context, request, cmd.glue);

        return response;
    }
};