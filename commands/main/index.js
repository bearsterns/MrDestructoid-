function ping() {
    /*  Checks if the bot is available.
        Usage: !ping 
    */

    return 'Uncle Sam reporting for duty! 🇺🇸 KKona 7';
}

function replace(request) {
    /*  Replaces one word with another.
        Usage: !replace [word replaced] [new word] [message]
    */

    if (request[1] === 'help') {

        return `Usage: ${process.env.PREFIX}replace [replaced_word] [new_word] [message]`;
    }

    const originalMessage = request.splice(3);
    const replacedMessage = originalMessage.join(' ');
    const re = new RegExp(`\\b${request[1]}\\b`, 'g');

    return replacedMessage.replace(re, request[2]);
}

function parrot(request) {
    /*  Regurgitates the user's message.   
        Usage: !parrot [message]
    */

    if (request[1] === 'help') {
        return `Usage: ${process.env.PREFIX}parrot [message]`;
    }

    const originalMessage = request.splice(1);
    const parrotedMessage = originalMessage.join(' ');

    return parrotedMessage;
}

module.exports = {
    ping,
    replace,
    parrot
};