// __tests__/app.test.js
const request = require('supertest');
const app = require('../index'); // Import the app to test
const { Sequelize } = require('sequelize');

describe('Test Routes', () => {
    let sequelize;

    beforeAll(() => {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                },
            },
        });
    });

    it('should return 200 for the home route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('My Blog');  // Adjust based on actual content
    });

    it('should return 200 for the create post route', async () => {
        const res = await request(app).get('/posts/new');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Create a New Post');  // Adjust based on actual content
    });

    afterAll(async () => {
        await sequelize.close();  // Properly close the connection
    });
});
