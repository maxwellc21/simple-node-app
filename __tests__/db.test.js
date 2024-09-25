const { Sequelize } = require('sequelize');
require('dotenv').config();  // Load environment variables from .env file

describe('Database Connection', () => {
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

    it('should connect to the database successfully', async () => {
        try {
            await sequelize.authenticate();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed', error);
        }
    });

    afterAll(async () => {
        if (sequelize) {
            await sequelize.close();  // Properly close the connection
            console.log('Database connection closed.');
        }
    });
});
