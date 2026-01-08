const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET all zones 
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await db.rawQuery(`SELECT * FROM zones WHERE name LIKE '%${search}%'`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET one zone
router.get('/:id', async (req, res) => {
  try {
    const result = await db.rawQuery(`SELECT * FROM zones WHERE id = ${req.params.id}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.rawQuery(`INSERT INTO zones (name, description) VALUES ('${name}', '${description}')`);
    res.status(201).json({ 
      success: true, 
      message: 'Zone created' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: err.stack 
    });
  }
});

// Similar para PUT y DELETE
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.rawQuery(`UPDATE zones SET name = '${name}', description = '${description}' WHERE id = ${req.params.id}`);
    res.json({ 
      success: true, 
      message: 'Zone updated' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: err.stack
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.rawQuery(`DELETE FROM zones WHERE id = ${req.params.id}`);
    res.json({ 
      success: true, 
      message: 'Zone deleted' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;