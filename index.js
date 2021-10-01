const { fork } = require("child_process");
const process = require("process");
const fs = require("fs");

if (process.argv.length != 3) {
    console.log("Usage: node index.js [--alt | --cls |channel_name]");
    console.log("\nOptions:");
    console.log("        --alt, Uses alternative bot username used for live testing on a default channel specified in env vars.");
    console.log("        --cls, Restores listener command helpers (helpers.json) to their inital state.");
    console.log("        channel_name, Bot joins specified channel.");
    process.exit();
}
if (process.argv[2] === "--alt") {
    fork(__dirname + "\\mrdestructoid.js", ["--alt", "true"]);
}
else if (process.argv[2] === "--cls") { clearHelpers(); }
else {
    fork(__dirname + "\\mrdestructoid.js", ["--alt", "false", "--join", `${process.argv[2]}`]);
}

function clearHelpers() {
    const path = './helper.json'
    let attachHelper = fs.readFileSync(path);
    attachHelper = JSON.parse(attachHelper);

    attachHelper.attached = false;
    attachHelper.attach.username = null;
    attachHelper.glue.username = null;
    attachHelper.attach.messageToAttach = null;
    attachHelper.attach.attachedMessage = null;
    attachHelper.glue.attachedMessage = null;
    fs.writeFileSync(path, JSON.stringify(attachHelper, null, 4), (err) => { if (err) throw err });
    process.exit();
}
["SIGINT", "exit"].forEach(event => { process.on(event, clearHelpers)});