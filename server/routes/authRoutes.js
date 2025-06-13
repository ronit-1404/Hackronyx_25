const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const extensionController = require('../controllers/extensionController.js');
const authMiddleware = require('../middleware/auth.js');

// User authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/preferences', authMiddleware, userController.updatePreferences);

// Extension authentication
router.post('/extension/authenticate', extensionController.authenticate);

module.exports = router;