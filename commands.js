const PREFIX = '!';

module.exports.execCmd = function executeCommand(command) {
    const commandLines = command.split(' ');

    /*  Checks if the bot is available 
        Usage: !ping 
    */
    if (commandLines[0] === `${PREFIX}ping`) {

        return 'Uncle Sam reporting for duty! 🇺🇸 KKona 7';
    }


    /*  Replaces one word with another   
        Usage: !replace [word replaced] [new word] [message]
    */
    if (commandLines[0] === `${PREFIX}replace`) {
        if (commandLines[1] === 'help') {
            return "Usage: !replace [replaced_word] [new_word] [message]";
        }

        const originalMsg = commandLines.splice(3);
        let replacedMsg = originalMsg.join(' ');
        const re = new RegExp(`\\b${commandLines[1]}\\b`, 'g');

        return replacedMsg.replace(re, commandLines[2]);
    }

    if (commandLines[0] === `${PREFIX}parrot`) {

        const originalMsg = commandLines.splice(1);
        let replacedMsg = originalMsg.join(' ');

        return replacedMsg;
    }

};