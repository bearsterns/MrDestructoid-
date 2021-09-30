const fs = require('fs');

// Checks if the bot is available.
function ping() {
    let response = {
        message: "Reporting for duty! 🇺🇸 KKona 7.",
        status: true
    };
    return response;
}

// Replaces one word with another.
function replace(context, request) {
    switch (request[1]) {
        case "help":
            response = {
                message: "Replace two or more words.",
                status: true
            };
            return response;
        case "usage":
            response = {
                message: `Usage: ${process.env.PREFIX}replace [replaced word(s)] [new word(s)] [message]`,
                status: true
            };
            return response;
    }

    const originalMessage = request.splice(3);
    const replacedMessage = originalMessage.join(' ');
    const re = new RegExp(`\\b${request[1]}\\b`, 'g');

    let response = {
        message: replacedMessage.replace(re, request[2]),
        status: true
    };
    return response;
}

// Regurgitates the user's message
function parrot(context, request) {
    if (request[1] === 'usage') {
        return `Usage: ${process.env.PREFIX}parrot [message]`;
    }

    const originalMessage = request.splice(1);
    const parrotedMessage = originalMessage.join(' ');

    let response = {
        message: parrotedMessage,
        status: true
    };
    return response;
}


function attach(context, request) {
    let response;
    switch (request[1]) {
        case "help":
            response = {
                message: "Prints an assigned message everytime an associated user says a particular word or a phrase.",
                status: true
            };
            return response;
        case "usage":
            response = {
                message: `Usage: ${process.env.PREFIX}attach [username] [message to attach] [message]`,
                status: true
            };
            return response;
    }

    const path = './helper.json';
    let attachHelper = fs.readFileSync(path);
    attachHelper = JSON.parse(attachHelper);


    if (request.length === 2 && request[1] == "stop") {
        attachHelper.attached = false;
        attachHelper.attach.username = null;
        attachHelper.attach.messageToAttach = null;
        attachHelper.attach.attachedMessage = null;
        fs.writeFileSync(path, JSON.stringify(attachHelper, null, 4), (err) => { if (err) throw err });

        response = { message: null, status: true };
        return response;
    }
    if (attachHelper.attached &&
        context.username === attachHelper.attach.username &&
        request[1] === attachHelper.attach.messageToAttach
    ) {
        response = {
            message: attachHelper.attach.attachedMessage,
            status: true
        };
        return response;
    }

    try {
        const messageDetails = request.splice(2).join(' ').split('🔗');
        attachHelper.attach.username = request[1];
        attachHelper.attach.messageToAttach = messageDetails[0].trim();
        attachHelper.attach.attachedMessage = messageDetails[1].trim();
        attachHelper.attached = true;
        fs.writeFileSync(path, JSON.stringify(attachHelper, null, 4), (err) => { if (err) throw err });
        response = { message: null, status: true };
        return response;
    }
    catch (err) {
        return { status: false }
    }
}


function glue(context, request) {
    let response;
    switch (request[1]) {
        case "help":
            response = {
                message: "Prints an \"glued\" message everytime an associated user enters a message.",
                status: true
            };
            return response;
        case "usage":
            response = {
                message: `Usage: ${process.env.PREFIX}glue [username] [message]`,
                status: true
            };
            return response;
    }

    const path = './helper.json';
    let attachHelper = fs.readFileSync(path);
    attachHelper = JSON.parse(attachHelper);

    console.log("Should be stopped")
    if (request.length === 2 && request[1] == "stop") {
        attachHelper.attached = false;
        attachHelper.glue.username = null;
        attachHelper.glue.attachedMessage = null;
        fs.writeFileSync(path, JSON.stringify(attachHelper, null, 4), (err) => { if (err) throw err });

        response = { message: null, status: true };
        return response;
    }
    if (attachHelper.attached &&
        context.username === attachHelper.glue.username
    ) {
        response = {
            message: attachHelper.glue.attachedMessage,
            status: true
        };
        return response;
    }

    try {
        const messageDetails = request.splice(2).join(' ');
        attachHelper.glue.username = request[1];
        attachHelper.glue.attachedMessage = messageDetails;
        attachHelper.attached = true;
        fs.writeFileSync(path, JSON.stringify(attachHelper, null, 4), (err) => { if (err) throw err });
        response = { message: null, status: true };
        return response;
    }
    catch (err) {
        return { status: false }
    }
}


module.exports = {
    ping,
    replace,
    parrot,
    attach,
    glue
};