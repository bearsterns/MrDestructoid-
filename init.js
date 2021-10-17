const db = require('./config/db-config');


module.exports = new Promise((resolve, reject) => {
    (
        async function (resolve, reject) {
            const commands = {};
            let connection;

            try {
                connection = await db.getConnection();
                const rows = await connection
                    .query(`SELECT * from ${process.env.TBL_COMMANDS}`);

                rows.forEach(command => {
                    commands[command.commandName] = {
                        whitelisted: command.whitelisted,
                    };
                });
                process.env.commands = JSON.stringify(commands);
                
                resolve();
            }
            catch (err) { reject(err); }
            finally { if (connection) return connection.end(); }
        }
    )(resolve, reject);
});