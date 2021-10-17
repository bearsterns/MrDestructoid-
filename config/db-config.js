const mariadb = require('mariadb');


let pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSW,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME
});


module.exports = pool;