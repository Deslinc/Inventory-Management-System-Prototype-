// ============================================================
// BACKEND API — Node.js + Express + PostgreSQL
// Run: node index.js
// Make sure you have a .env file with DATABASE_URL set
// ============================================================
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// GET all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inventory ORDER BY sku ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single item by ID
app.get('/api/inventory/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inventory WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT — update a row when the user edits a cell in the grid
app.put('/api/inventory/:id', async (req, res) => {
  const { name, price, oh, supplier, status } = req.body;
  try {
    await pool.query(
      `UPDATE inventory
       SET name=$1, price=$2, oh=$3, supplier=$4, status=$5, updated_at=NOW()
       WHERE id=$6`,
      [name, price, oh, supplier, status, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// POST — add a new item
app.post('/api/inventory', async (req, res) => {
  const { sku, name, vendor, cat, subcat, food, price, oh, status } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO inventory (sku, name, vendor, cat, subcat, food, price, oh, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [sku, name, vendor, cat, subcat, food, price, oh, status || 'Active']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Insert failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
