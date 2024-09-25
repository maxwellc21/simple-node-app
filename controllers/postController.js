const { Post } = require('../models');

// Fetch all posts
const getPosts = async (req, res) => {
    const posts = await Post.findAll();
    res.render('index', { posts });
};

// Render form to create a new post
const renderCreateForm = (req, res) => {
    res.render('create');
};

// Create a new post
const createPost = async (req, res) => {
    const { title, content } = req.body;
    await Post.create({ title, content });
    res.redirect('/');
};

// Render form to edit a post
const renderEditForm = async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    res.render('edit', { post });
};

// Update a post
const updatePost = async (req, res) => {
    const { title, content } = req.body;
    await Post.update({ title, content }, { where: { id: req.params.id } });
    res.redirect('/');
};

// Delete a post
const deletePost = async (req, res) => {
    await Post.destroy({ where: { id: req.params.id } });
    res.redirect('/');
};

module.exports = {
    getPosts,
    renderCreateForm,
    createPost,
    renderEditForm,
    updatePost,
    deletePost
};
