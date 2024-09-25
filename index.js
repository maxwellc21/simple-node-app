const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { Sequelize } = require('sequelize');
const postController = require('./controllers/postController');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for handling PUT and DELETE methods
app.use(methodOverride('_method'));

// Serve static files (CSS, images, etc.) from the "public" folder
app.use(express.static('public'));

// Initialize the PostgreSQL connection using environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for connecting to Render-hosted Postgres
        },
    },
});

// Test connection and sync database
const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

initDB();

// Define routes for blog posts
app.get('/', postController.getPosts);
app.get('/posts/new', postController.renderCreateForm);
app.post('/posts', postController.createPost);
app.get('/posts/:id/edit', postController.renderEditForm);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
