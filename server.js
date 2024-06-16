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
  res.sendFile(path.join(__dirname, 'public', 'question_form.html'));
});

app.get('/search_questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search_questions.html'));
});

// Serve find.html
app.get('/find', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'find.html'));
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

app.get('/get_question_by_id', async (req, res) => {
  const { id } = req.query;
  try {
    const questionResult = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    const ratingResult = await pool.query(
      'SELECT AVG(rate) as current_rating, COUNT(rate) as rating_count FROM question_rate WHERE question_id = $1',
      [id]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).send('Question not found');
    }

    const question = questionResult.rows[0];
    const rating = ratingResult.rows[0];

    question.current_rating = rating.current_rating ? parseFloat(rating.current_rating).toFixed(2) : 0;
    question.rating_count = rating.rating_count;

    res.json(question);
  } catch (error) {
    console.error('Error fetching question by id:', error);
    res.status(500).send('Error fetching question by id');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received registration request:', username, password);  // Debug information

  try {
    const result = await pool.query(
      'INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    console.log('User registered successfully:', result.rows[0]);  // Debug information
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/submit_question', async (req, res) => {
  const { question, type, category, answer, creator } = req.body;

  console.log('Received question submission:', { question, type, category, answer, creator });  // Debug information

  try {
    const result = await pool.query(
      'INSERT INTO questions (question, type, category, answer, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [question, type, category, answer, creator]
    );
    console.log('Question submitted successfully:', result.rows[0]);  // Debug information
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting question data:', error);
    res.status(500).send('Error inserting question data');
  }
});

app.post('/search_questions', async (req, res) => {
  const { query, category } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM questions WHERE LOWER(question) LIKE $1 AND category = $2',
      [`%${query}%`, category]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
});

// Increment answer count
// Increment answer count
app.post('/increment_answer_count', async (req, res) => {
  const { question_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE questions SET answer_count = answer_count + 1 WHERE id = $1 RETURNING *',
      [question_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error incrementing answer count:', error);
    res.status(500).send('Error incrementing answer count');
  }
});

// Rate a question
app.post('/rate_question', async (req, res) => {
  const { question_id, user_id, rate } = req.body;

  try {
    // Check if the user has already rated this question
    const checkRating = await pool.query(
      'SELECT * FROM question_rate WHERE question_id = $1 AND user_id = $2',
      [question_id, user_id]
    );

    if (checkRating.rows.length > 0) {
      return res.status(400).send('User has already rated this question');
    }

    // Insert the new rating
    await pool.query(
      'INSERT INTO question_rate (question_id, user_id, rate) VALUES ($1, $2, $3)',
      [question_id, user_id, rate]
    );

    // Update the questions table with the new rating
    const result = await pool.query(
      `UPDATE questions
       SET total_rating = total_rating + $2,
           rating_count = rating_count + 1,
           current_rating = (total_rating + $2) / (rating_count + 1)
       WHERE id = $1
       RETURNING *`,
      [question_id, rate]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error rating question:', error);
    res.status(500).send('Error rating question');
  }
});


// Rate a question


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
