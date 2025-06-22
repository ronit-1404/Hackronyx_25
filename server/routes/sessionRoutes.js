const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');


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


// Upload audio recording
router.post('/:sessionId/audio', sessionController.uploadAudio);

// Get audio metrics
router.get('/:sessionId/audio/metrics', sessionController.getAudioMetrics);
module.exports = router;