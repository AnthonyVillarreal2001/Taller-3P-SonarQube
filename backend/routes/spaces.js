const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET all spaces 
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await db.rawQuery(`SELECT * FROM spaces WHERE number LIKE '%${search}%'`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET one space
router.get('/:id', async (req, res) => {
  try {
    const result = await db.rawQuery(`SELECT * FROM spaces WHERE id = ${req.params.id}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST create space
router.post('/', async (req, res) => {
  const { zone_id, number, status } = req.body;
  try {
    await db.rawQuery(`INSERT INTO spaces (zone_id, number, status) VALUES (${zone_id}, '${number}', '${status}')`);
    res.status(201).json({ 
      success: true, 
      message: 'Space created' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: err.stack
    });
  }
});

// PUT update space
router.put('/:id', async (req, res) => {
  const { zone_id, number, status } = req.body;
  try {
    await db.rawQuery(`UPDATE spaces SET zone_id = ${zone_id}, number = '${number}', status = '${status}' WHERE id = ${req.params.id}`);
    res.send('Space updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE space
router.delete('/:id', async (req, res) => {
  try {
    await db.rawQuery(`DELETE FROM spaces WHERE id = ${req.params.id}`);
    res.send('Space deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;