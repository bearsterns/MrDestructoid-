const cmd = require('./commands');
const authz = require('./utils/authz');

module.exports.execCmd = function executeCommand(context, command) {
    const commandLines = command.split(' ');

    if (commandLines[0] === `${process.env.PREFIX}ping`) {
        return cmd.ping();
    }

    if (commandLines[0] === `${process.env.PREFIX}replace`) {
        return cmd.replace(commandLines);
    }

    if (commandLines[0] === `${process.env.PREFIX}parrot`) {
        const checkOwner = authz.isOwner(
            context,
            cmd.parrot(context, commandLines)
        );

        return checkOwner;
    }

    return;
};