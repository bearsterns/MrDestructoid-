function ping() {
    /*  Checks if the bot is available.
        Usage: !ping 
    */

    return 'Uncle Sam reporting for duty! 🇺🇸 KKona 7';
}

function replace(commandLines) {
    /*  Replaces one word with another.
        Usage: !replace [word replaced] [new word] [message]
    */

    if (commandLines[1] === 'help') {

        return `Usage: ${process.env.PREFIX}replace [replaced_word] [new_word] [message]`;
    }

    const originalMsg = commandLines.splice(3);
    let replacedMsg = originalMsg.join(' ');
    const re = new RegExp(`\\b${commandLines[1]}\\b`, 'g');

    return replacedMsg.replace(re, commandLines[2]);
}

function parrot(context, commandLines) {
    /*  Regurgitates the user's message.   
        Usage: !parrot [message]
    */

    if (commandLines[1] === 'help') {
        return `Usage: ${process.env.PREFIX}parrot [message]`;
    }

    const originalMsg = commandLines.splice(1);
    let replacedMsg = originalMsg.join(' ');

    return replacedMsg;
}

module.exports = {
    ping,
    replace,
    parrot
};