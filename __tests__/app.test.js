const request = require('supertest');
const app = require('../index'); // Update to reference index.js

describe('GET /', () => {
    it('should respond with Hello, Jenkins and Kubernetes! Its working now', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello, Jenkins and Kubernetes! Its working now');
    });
});
