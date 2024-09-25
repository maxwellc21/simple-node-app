const { Sequelize, DataTypes } = require('sequelize');

// Define the connection string with SSL options for Render PostgreSQL
const sequelize = new Sequelize('postgresql://blog_app_db_ect7_user:bSQRVsyZ4dcfcTPTDhQzRoofiGTwYLWI@dpg-crpq2ajv2p9s7389vm30-a.singapore-postgres.render.com/blog_app_db_ect7', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Ensure SSL connection is required
            rejectUnauthorized: false // Accept self-signed certificates (commonly used on platforms like Render)
        }
    },
    logging: false // Optional: To disable query logging in the console
});

// Define the Post model
const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

// Initialize the database and synchronize the Post model
const initDB = async () => {
    try {
        await sequelize.authenticate(); // Check connection to the database
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true }); // Automatically create/alter the table if it doesn't exist
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { Post, initDB };
