const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nutech-db',
    password: 'superUser',
    port: 5432,
    idleTimeoutMillis: 500
})

module.exports = pool