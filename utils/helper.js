const cmd = require('../commands');
const { isOwner } = require('./authz');


module.exports.execCmd = (context, request) => {
    const commands = JSON.parse(process.env.commands);
    const commandName = request[0].substring(process.env.PREFIX.length);
    const commandCategory = commands[commandName].commandCategory;
    
    try {
        if (commands[commandName]) {
            if (!commands[commandName].whitelisted) {
                return cmd[commandCategory][commandName]();
            }
            else {
                return isOwner(
                    context,
                    request,
                    cmd[commandCategory][commandName]
                );
            }
        }
    }
    catch(err) {
        console.error(err);
        process.exit();
    }
};