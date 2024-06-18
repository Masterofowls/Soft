const request = require('supertest');
const app = require('./server'); // Make sure this path is correct

describe('API Tests', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should log in a user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should submit a question', async () => {
    const res = await request(app)
      .post('/submit_question')
      .send({
        question: 'What is the capital of France?',
        type: 'text',
        category: 'geography',
        answer: 'Paris',
        creator: 'testuser'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });
});
