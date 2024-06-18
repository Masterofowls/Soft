const request = require('supertest');
const { app, server } = require('../../server'); // скорректируйте путь к вашему server.js

afterAll((done) => {
  server.close(() => {
    console.log('Server closed');
    done();
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