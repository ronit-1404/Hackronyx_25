const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');
const authMiddleware = require('../middleware/auth.js');

// All session routes require authentication
router.use(authMiddleware);

// Session management
router.post('/start', sessionController.startSession);
router.post('/:sessionId/end', sessionController.endSession);
router.get('/active', sessionController.getActiveSession);
router.get('/:sessionId', sessionController.getSessionDetails);
router.get('/', sessionController.getUserSessions);
router.get('/stats/summary', sessionController.getSessionStats);

module.exports = router;