// __tests__/server.test.js
const request = require('supertest');
const app = require('../server'); // Adjust the path if needed

describe('User API', () => {
  let testUserId;

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid');
    testUserId = response.body.userid;
  });

  test('should log in the user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('userid', testUserId);
  });

  test('should delete the test user', async () => {
    const response = await request(app)
      .delete(`/users/${testUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted');
  });
});

describe('Question API', () => {
  let testQuestionId;

  test('should submit a new question', async () => {
    const response = await request(app)
      .post('/submit_question')
      .send({
        question: 'What is Jest?',
        type: 'multiple_choice',
        category: 'IT',
        answer: 'A testing framework',
        creator: 'testuser',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    testQuestionId = response.body.id;
  });

  test('should delete the test question', async () => {
    const response = await request(app)
      .delete(`/questions/${testQuestionId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Question deleted');
  });
});
