const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
    let server;

    beforeAll(() => {
        server = app.listen(4000);
    });

    afterAll(done => {
        server.close(done);
    });

    test('should register a new user', async () => {
        const response = await request(server)
            .post('/register')
            .send({ username: 'testuser', password: 'testpassword' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('should log in a user', async () => {
        const response = await request(server)
            .post('/login')
            .send({ username: 'testuser', password: 'testpassword' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    test('should submit a question', async () => {
        const response = await request(server)
            .post('/submit_question')
            .send({
                question: 'What is the capital of France?',
                type: 'text',
                category: 'geography',
                answer: 'Paris',
                creator: 'testuser'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
});
