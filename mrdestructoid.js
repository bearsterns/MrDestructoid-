require('dotenv').config()
const tmi = require('tmi.js');

const { execCmd } = require('./commands');

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME,
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
 
  /* Trims whitespace on either side of the chat message and replaces multiple
     whitespaces, tabs or newlines between words with just one whitespace */
  let command = msg.trim().replace(/\s\s+/g, ' ');
  const message = execCmd(command);

  if (message) {
    console.log(`* Executed ${command} command`);
    client.say(target, message);
  }
  else {
    console.log(`* Unknown command ${command}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}