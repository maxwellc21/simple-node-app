// __tests__/app.test.js
const request = require('supertest');
const { app, getServer } = require('../index'); // Import both app and the getServer function

// Test Routes
describe('Test Routes', () => {
    let server;

    // Start the server before all tests
    beforeAll(() => {
        server = getServer(); // Initialize the server for tests
    });

    // Test the home route
    it('should return 200 for the home route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('My Blog'); // Check if "My Blog" is in the response
    });

    // Test the create new post route
    it('should return 200 for the create new post route', async () => {
        const res = await request(app).get('/posts/new');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Create a New Post'); // Check if "Create a New Post" is in the response
    });

    // After all tests, close the server
    afterAll((done) => {
        server.close(done); // Close the server to avoid open handles
    });
});
