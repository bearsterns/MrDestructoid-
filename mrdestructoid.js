require('dotenv').config();
const tmi = require('tmi.js');
const process = require('process');
const fs = require('fs');

const { execCmd } = require('./helper');

if (
    (process.argv.length !== 4 &&
        process.argv.length !== 6) ||
    process.argv[2] !== "--alt" ||
    (
        process.argv[3] !== "true" &&
        process.argv[3] !== "false"
    )
) {
    console.log("Usage: node mrdestructoid.js --alt <boolean> [--join <channel_name>]");
    console.log("\nOptions:");
    console.log("        --alt <boolean>, Switches between alternative bot username used for live testing on a default channel specified in env vars.");
    console.log("        --join <channel_name>, Bot joins specified channel, alt flag must be false.");
    process.exit();
}

// Define configuration options
let opts = {
    identity: {
        username: (process.argv[3] === "true")
            ? process.env.BOT_USERNAME_DEV
            : process.env.BOT_USERNAME,
        password: (process.argv[3] === "true")
            ? process.env.OAUTH_TOKEN_DEV
            : process.env.OAUTH_TOKEN
    },
    channels: [
        (process.argv[3] === "true")
            ? process.env.CHANNEL_NAME_DEV
            : (
                // TODO: Dynamic append/removal of channel names via CLI or Twitch IRC
                (process.argv[5] == undefined)
                    ? process.env.CHANNEL_NAME
                    : process.argv[5]
            )
    ]
}


// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessagePreProcess);
client.on('connected', onConnectedHandler);


client.connect();

// Called every time a message comes in
function onMessagePreProcess(target, context, msg, self) {
    const prefixLength = process.env.PREFIX.length;
    let helper = fs.readFileSync("./helper.json");
    helper = JSON.parse(helper);

    if (self) {
        process.env.DUPMSG_STATUS = process.env.DUPMSG_STATUS === "1" ? 0 : 1;
        return; // Ignore messages from the bot
    }
    // Ignore non-prefixed messages
    if (!(msg.substring(0, prefixLength) === process.env.PREFIX) && !helper.attached) {
        return;
    }
    if (!(msg.substring(0, prefixLength) === process.env.PREFIX)
        && helper.attached
        && (context.username !== helper.attach.username
            || msg.trim() !== helper.attach.messageToAttach)
        && context.username !== helper.glue.username
    ) {
        return;
    }

    /* Trims whitespace on either side of the chat message and replaces multiple
       whitespaces, tabs or newlines between words with just one whitespace */
    let request = msg.trim().replace(/\s\s+/g, ' ');
    request = request.split(' ');
    let response;
    if (helper.attached
        && (context.username === helper.attach.username)
        && (msg.trim() === helper.attach.messageToAttach)) {
        response = {
            message: helper.attach.attachedMessage
        };
    }
    else if (helper.attached
        && (context.username === helper.glue.username)) {
        response = {
            message: helper.glue.attachedMessage
        };
    }
    else {
        response = execCmd(context, request);
    }

    onMessageHandler(target, request, response);
}


function onMessageHandler(target, request, response) {
    if (response && response.message) {
        if (process.env.DUPMSG_STATUS === "1") {
            // Circumvents Twitch's duplicate message filter 
            response.message = response.message + ` ${process.env.DUPMSG_CHAR}`;
        }
        client.say(target, response.message);
    }
    if (response && response.status) {
        console.log(`* Executed ${request.join(' ')} command`);
    }
    else if (request[0].substring(0, process.env.PREFIX.length) === process.env.PREFIX) {
        console.log(`* Unknown command ${request.join(' ')}`);
    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}