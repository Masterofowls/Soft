const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/question_form', (req, res) => {
  res.sendFile(path.join(__dirname, 'question_form.html'));
});

app.get('/search_questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'search_questions.html'));
});

app.get('/get_question_of_the_day', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching question of the day:', error);
    res.status(500).send('Error fetching question of the day');
  }
});

app.get('/get_all_questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.json({ questions: result.rows });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received registration request:', username, password);  // Отладочная информация

  try {
    const result = await pool.query(
      'INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    console.log('User registered successfully:', result.rows[0]);  // Отладочная информация
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/submit_question', async (req, res) => {
  const { question, type, category, answer, creator } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO questions (question, type, category, answer, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [question, type, category, answer, creator]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting question data:', error);
    res.status(500).send('Error inserting question data');
  }
});

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
