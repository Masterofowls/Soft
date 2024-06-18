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
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
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
    if (questionResult.rows.length === 0) {
      return res.status(404).send('Question not found');
    }

    const question = questionResult.rows[0];
    const ratingResult = await pool.query(
      'SELECT total_rating, rating_count FROM rates WHERE question_id = $1', [id]
    );

    if (ratingResult.rows.length > 0) {
      question.total_rating = ratingResult.rows[0].total_rating;
      question.rating_count = ratingResult.rows[0].rating_count;
    } else {
      question.total_rating = 0;
      question.rating_count = 0;
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question by id:', error);
    res.status(500).send('Error fetching question by id');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received registration request:', username, password);

  try {
    const result = await pool.query(
      'INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    console.log('User registered successfully:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', username, password);

  try {
    const result = await pool.query(
      'SELECT userid FROM usernames WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      console.log('User logged in successfully:', result.rows[0]);
      res.status(200).json(result.rows[0]);
    } else {
      console.error('Invalid username or password');
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

app.post('/submit_question', async (req, res) => {
  const { question, type, category, answer, creator } = req.body;

  console.log('Received question submission:', { question, type, category, answer, creator });

  try {
    const result = await pool.query(
      'INSERT INTO questions (question, type, category, answer, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [question, type, category, answer, creator]
    );

    await pool.query(
      'INSERT INTO rates (question_id, question) VALUES ($1, $2)',
      [result.rows[0].id, question]
    );

    console.log('Question submitted successfully:', result.rows[0]);
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

app.post('/rate_question', async (req, res) => {
  const { question_id, user_id, rate } = req.body;

  console.log('Received rating:', { question_id, user_id, rate });

  try {
    const checkRating = await pool.query(
      'SELECT * FROM question_rate WHERE question_id = $1 AND user_id = $2',
      [question_id, user_id]
    );

    if (checkRating.rows.length > 0) {
      console.log('User has already rated this question');
      return res.status(400).send('User has already rated this question');
    }

    await pool.query(
      'INSERT INTO rates (question_id, rating_count, total_rating) VALUES ($1, 1, $2) ON CONFLICT (question_id) DO UPDATE SET rating_count = rates.rating_count + 1, total_rating = rates.total_rating + EXCLUDED.total_rating',
      [question_id, rate]
    );

    console.log('New rating inserted into rates');

    res.status(200).send('Rating submitted successfully');
  } catch (error) {
    console.error('Error rating question:', error);
    res.status(500).send('Error rating question');
  }
});

app.get('/get_user_questions', async (req, res) => {
  const { username } = req.query;

  try {
    const userResult = await pool.query('SELECT userid, password FROM usernames WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const userId = userResult.rows[0].userid;
    const userPassword = userResult.rows[0].password;

    const questionsResult = await pool.query('SELECT * FROM questions WHERE creator = $1', [username]);

    res.json({ questions: questionsResult.rows, password: userPassword });
  } catch (error) {
    console.error('Error fetching user questions:', error);
    res.status(500).send('Error fetching user questions');
  }
});

app.get('/run-tests', (req, res) => {
  const { exec } = require('child_process');
  exec('npm test -- --json --outputFile=test-results.json', (err, stdout, stderr) => {
    if (err) {
      console.error('Error running tests:', err);
      return res.status(500).send('Error running tests');
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
