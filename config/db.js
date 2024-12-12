const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'postgres.railway.internal',
    database: 'railway',
    password: 'xXoMtpqaCgJgRBLBmPohQASfQXOQLfHh',
    port: 5432,
    idleTimeoutMillis: 500
})

module.exports = pool