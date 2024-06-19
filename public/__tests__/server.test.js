const request = require('supertest');
const { app, server } = require('../../server');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

let client;

beforeAll(async () => {
  client = await pool.connect();
});

beforeEach(async () => {
  await client.query('BEGIN');
  await client.query('DELETE FROM usernames WHERE username LIKE $1', ['testuser%']); // Удаление тестовых пользователей
});

afterEach(async () => {
  await client.query('ROLLBACK');
});

afterAll(async () => {
  await client.release();
  server.close();
});

describe('API Tests', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: `testuser_${Date.now()}`, password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid');
  });

  test('should log in a user', async () => {
    await client.query('INSERT INTO usernames (username, password) VALUES ($1, $2)', ['testuser', 'password123']);

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid');
  });

  test('should submit a question', async () => {
    const response = await request(app)
      .post('/submit_question')
      .send({ question: 'What is 2+2?', type: 'math', category: 'general', answer: '4', creator: 'testuser' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  }, 10000); // Увеличение тайм-аута до 10 секунд
});