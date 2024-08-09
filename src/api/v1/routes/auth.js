const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
// Import middlewares
const { loginLimiter } = require('../middlewares/rateLimiter');
const { logSuccessfulLogin } = require('../middlewares/logger');

// Define routes
router.post('/register', authController.register);
router.post('/login', loginLimiter, logSuccessfulLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/validate-token', authController.validateToken);
router.get('/test', authController.test);

module.exports = router;
