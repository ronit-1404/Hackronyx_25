const express = require('express');
const router = express.Router();
const extensionController = require('../controllers/extensionController.js');
const authMiddleware = require('../middleware/auth.js');

// Authentication required for all extension routes except error logging
router.use('/init', authMiddleware);
router.use('/activity', authMiddleware);
router.use('/intervention', authMiddleware);

// Extension specific routes
router.post('/init', extensionController.initPageTracking);
router.post('/activity', extensionController.batchActivityData);
router.get('/intervention/:sessionId', extensionController.checkIntervention);
router.post('/error', extensionController.logError);

module.exports = router;