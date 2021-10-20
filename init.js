const db = require('./config/db-config');


module.exports = new Promise((resolve, reject) => {
    (
        async function (resolve, reject) {
            const commands = {};
            const commandsWhitelist = {};
            let connection;

            try {
                connection = await db.getConnection();

                (await connection
                    .query(`SELECT * from ${process.env.TBL_COMMANDS}`))
                    .forEach(command => {
                        const commandName = command.commandName
                        const commandCategory = command.commandCategory;
                        const whitelisted = command.whitelisted;

                        commands[commandName] = {
                            commandCategory: commandCategory,
                            whitelisted: (whitelisted === 1 ? true : false)
                        };
                    });

                (await connection
                    .query(`SELECT * from ${process.env.TBL_WHITELISTS}`))
                    .forEach(whitelist => {
                        const userID = whitelist.userID;
                        const commandName = whitelist.commandName;

                        if (!commandsWhitelist[userID]) {
                            // Initialize the array
                            commandsWhitelist[userID] = [commandName];
                        }
                        else {
                            commandsWhitelist[userID]
                                .push(commandName);
                        }
                    });

                process.env.commands = JSON.stringify(commands);
                process.env.commandsWhitelist = JSON
                    .stringify(commandsWhitelist);

                resolve();
            }
            catch (err) { reject(err); }
            finally { if (connection) return connection.end(); }
        }
    )(resolve, reject);
});