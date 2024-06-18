const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

const { registerUser, loginUser, submitQuestion } = require('./server');

describe('API Tests', () => {
  test('should register a new user', async () => {
    const result = await registerUser('testuser', 'password');
    expect(result).toHaveProperty('id');
  });

  test('should log in a user', async () => {
    const result = await loginUser('testuser', 'password');
    expect(result).toHaveProperty('id');
  });

  test('should submit a question', async () => {
    const result = await submitQuestion({
      question: 'What is the capital of France?',
      type: 'text',
      category: 'geography',
      answer: 'Paris',
      creator: 'testuser'
    });
    expect(result).toHaveProperty('id');
  });
});

// Mock functions for database operations
async function registerUser(username, password) {
  const result = await pool.query(
    'INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *',
    [username, password]
  );
  return result.rows[0];
}

async function loginUser(username, password) {
  const result = await pool.query(
    'SELECT id FROM usernames WHERE username = $1 AND password = $2',
    [username, password]
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    throw new Error('Invalid username or password');
  }
}

async function submitQuestion({ question, type, category, answer, creator }) {
  const result = await pool.query(
    'INSERT INTO questions (question, type, category, answer, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [question, type, category, answer, creator]
  );
  return result.rows[0];
}
