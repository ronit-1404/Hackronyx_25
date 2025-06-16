const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');
const authMiddleware = require('../middleware/auth.js');

// Apply auth middleware to ALL routes
router.use(authMiddleware);

// Get user sessions with pagination and filtering
router.get('/', sessionController.getUserSessions);

// Start a new session
router.post('/start', sessionController.startSession);

// End a session
router.post('/:sessionId/end', sessionController.endSession);

// Get session details
router.get('/:sessionId', sessionController.getSessionDetails);

// Get session status
router.get('/:sessionId/status', sessionController.checkSessionStatus);

module.exports = router;