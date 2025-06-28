const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const extensionController = require('../controllers/extensionController.js');
//const authMiddleware = require('../middleware/auth.js');
const adminController = require('../controllers/adminController.js')

// User authentication routes
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/profile',  userController.getProfile);
router.put('/preferences',  userController.updatePreferences);
router.post('/admin/signup',adminController.adminLogin)
router.post('/admin/register',adminController.adminSignup)

// Extension authentication
router.post('/extension/authenticate', extensionController.authenticate);

module.exports = router;