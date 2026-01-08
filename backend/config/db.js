const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'parking_db',
  password: 'postgres', 
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  rawQuery: (text) => pool.query(text), 
};