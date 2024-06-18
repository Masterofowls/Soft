const request = require('supertest');
const app = require('../server'); // Ensure the correct path to your server file

describe('API Tests', () => {
  let server;
  beforeAll((done) => {
    server = app.listen(3000, () => {
      global.agent = request.agent(server);
      done();
    });
  });

  afterAll((done) => {
    return server && server.close(done);
  });

  test('should register a new user', async () => {
    const response = await global.agent
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid');
  });

  test('should log in a user', async () => {
    const response = await global.agent
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid');
  });

  test('should submit a question', async () => {
    const response = await global.agent
      .post('/submit_question')
      .send({ question: 'What is 2+2?', type: 'math', category: 'general', answer: '4', creator: 'testuser' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
