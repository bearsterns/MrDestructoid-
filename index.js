const { fork } = require("child_process");
const fs = require("fs");
const path = require("path");

require('dotenv').config();
const _ = require('./init')


const init = () => {
    if (process.argv.length != 3) {
        console.log("Usage: node index.js [--alt | --cls |channel_name]");
        console.log("\nOptions:");
        console.log("        --alt, Uses alternative bot username used for live testing on a default channel specified in env vars.");
        console.log("        --cls, Restores listener command helpers (helpers.json) to their inital state.");
        console.log("        channel_name, Bot joins specified channel.");
        process.exit();
    }

    if (process.argv[2] === "--alt") {
        fork(path.join(__dirname, "mrdestructoid.js"), ["--alt", "true"]);
    }
    else if (process.argv[2] === "--cls") { clearHelpers(); }
    else {
        fork(
            path.join(__dirname, "mrdestructoid.js"),
            ["--alt", "false", "--join", `${process.argv[2]}`],
            { env: process.env }
        );
    }
}


const clearHelpers = () => {
    const helperPath = `${process.cwd()}/config/helper.json`;
    let attachHelper = fs.readFileSync(helperPath);

    attachHelper = JSON.parse(attachHelper);
    attachHelper.attached = false;
    attachHelper.attach.username = null;
    attachHelper.glue.username = null;
    attachHelper.attach.messageToAttach = null;
    attachHelper.attach.attachedMessage = null;
    attachHelper.glue.attachedMessage = null;
    fs.writeFileSync(helperPath, JSON.stringify(attachHelper, null, 4));
}


_
    .then(() => init())
    .catch((err) => {
        console.error("Database failed to initialize.\nReason:", err);
        console.info("\nCheck database configuration\n");
    });

["SIGINT", "exit"].forEach(event => { process.on(event, clearHelpers) });
