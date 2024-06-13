const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Middleware for serving static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Existing route to serve the form page
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Route to serve the question form page
app.get('/question_form', (req, res) => {
  res.sendFile(path.join(__dirname, 'question_form.html'));
});

// Route to serve the search questions page
app.get('/search_questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'search_questions.html'));
});

// Route to handle form submissions for users
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// Route to handle question submissions
app.post('/submit_question', async (req, res) => {
  const { question, type, category, answer } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO questions (question, type, category, answer) VALUES ($1, $2, $3, $4) RETURNING *',
      [question, type, category, answer]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting question data:', error);
    res.status(500).send('Error inserting question data');
  }
});

// Route to handle question search
app.post('/search_questions', async (req, res) => {
  const { category, type } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM questions WHERE category = $1 AND type = $2',
      [category, type]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
