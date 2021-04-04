require('dotenv').config()
const tmi = require('tmi.js');

const { execCmd } = require('./helper');

if (
  (process.argv.length !== 4 &&
    process.argv.length !== 6) ||
  process.argv[2] !== "--debug" ||
  (
    process.argv[3] !== "true" &&
    process.argv[3] !== "false"
  )
) {
  console.log("Usage: node mrdestructoid.js --debug [boolean] [OPTIONS]...");
  console.log("\nOptions:")
  console.log("        --join [CHANNEL_NAME], Bot joins specified channel, debug must be false. Default channel name must be specified in env vars.");
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
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);


// Connect to Twitch:
client.connect();


// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  const prefixLength = process.env.PREFIX.length;
  if (self) { return; } // Ignore messages from the bot
  // Ignore non-prefixed messages
  if (!(msg.substring(0, prefixLength) === process.env.PREFIX)) {
    return;
  }

  /* Trims whitespace on either side of the chat message and replaces multiple
     whitespaces, tabs or newlines between words with just one whitespace */
  let request = msg.trim().replace(/\s\s+/g, ' ');
  request = request.split(' ');
  const response = execCmd(context, request);

  if (response) {
    console.log(`* Executed ${request} command`);
    client.say(target, response);
  }
  else {
    console.log(`* Unknown command ${request}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}