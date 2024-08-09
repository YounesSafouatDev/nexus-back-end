const express = require('express');
const { createPost, getPosts, getUserType } = require('../controllers/postController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authenticate, createPost);
router.get('/post-type', authenticate, getUserType);
router.get('/', authenticate, getPosts);
module.exports = router;
