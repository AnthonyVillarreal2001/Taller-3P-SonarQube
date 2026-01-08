const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'parking_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5433,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  rawQuery: (text) => pool.query(text), 
};