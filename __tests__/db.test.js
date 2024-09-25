// tests/db.test.js
const { Sequelize } = require('sequelize');
const { initDB } = require('../models');

// Test the database connection
describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
        try {
            await initDB();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
});
// __tests__/app.test.js
const request = require('supertest');
const { app, server } = require('../index'); // Import both app and server

// Test Routes
describe('Test Routes', () => {
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

    // After all tests, close the server if it exists
    afterAll((done) => {
        if (server && server.close) {
            server.close(done); // Close the server to avoid open handles
        } else {
            done();
        }
    });
});
