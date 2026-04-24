const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,

  ssl: {
    rejectUnauthorized: false,
  },

  max: 10,                        // max pool connections
  idleTimeoutMillis: 60000,       // close idle clients after 60s
  connectionTimeoutMillis: 10000, // wait up to 10s to acquire a connection
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

module.exports = pool;