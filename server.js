const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Setup PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Setup CORS
app.use(cors());
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to submit data
app.post('/submit', async (req, res) => {
  const { user_name } = req.body;
  const created_at = new Date().toISOString();

  console.log('Received data:', { user_name, created_at });

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO gbgtable (user_name, created_at) VALUES ($1, $2) RETURNING *',
      [user_name, created_at]
    );
    client.release();
    
    console.log('Data inserted successfully:', result.rows);
    res.status(200).send('Data received and inserted');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data: ' + error.message);
  }
});

// Endpoint to fetch data
app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM gbgtable');
    client.release();
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});