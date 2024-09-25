// __tests__/app.test.js
const request = require('supertest');
const app = require('../index'); // Import the app to test

let server;

describe('Test Routes', () => {
    beforeAll((done) => {
        // Start the server before the tests run
        server = app.listen(4000, () => {
            console.log('Test server is running on port 4000');
            done();
        });
    });

    afterAll((done) => {
        // Close the server after all tests have run
        server.close(done);
    });

    it('should return 200 for the home route', async () => {
        const res = await request(server).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('My Blog');  // Adjust based on actual content
    });

    it('should return 200 for the create post route', async () => {
        const res = await request(server).get('/posts/new');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Create a New Post');  // Adjust based on actual content
    });
});
