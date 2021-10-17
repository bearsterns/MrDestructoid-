const cmd = require('../commands/main');
const { isOwner } = require('./authz');


module.exports.execCmd = (context, request) => {
    const commandName = request[0].substring(process.env.PREFIX.length);
    console.log(process.env.commands);
    const commands = JSON.parse(process.env.commands);

    if (commands[commandName]) {
        if (!commands[commandName].whitelisted) {
            return cmd[commandName]();
        }
        else {
            return isOwner(context, request, cmd[commandName]);
        }
    }
};