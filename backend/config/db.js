const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'parking_db',
  password: 'postgres',
  port: 5433,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  rawQuery: (text) => pool.query(text), 
};