const cmd = require('./commands/main');
const stock = require('./commands/stock-sim');
const { isOwner } = require('./utils/authz');

module.exports.execCmd = function executeCommand(context, request) {
    if (request[0] === `${process.env.PREFIX}ping`) {

        return cmd.ping();
    }

    if (request[0] === `${process.env.PREFIX}replace`) {

        return cmd.replace(request);
    }

    if (request[0] === `${process.env.PREFIX}parrot`) {
        const response = isOwner(context, request, cmd.parrot);

        return response;
    }

    if (request[0] === `${process.env.PREFIX}quote`) {
        const response = isOwner(context, request, stock.quote);

        return response;
    }

    return;
};