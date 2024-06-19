const request = require('supertest');
const { app, server } = require('../../server'); // adjust the path to your server.js
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
  await client.query('BEGIN');
});

afterAll(async () => {
  await client.query('ROLLBACK');
  client.release();
  server.close(() => {
    console.log('Server closed');
  });
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
  });
});
