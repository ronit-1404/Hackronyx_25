const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// All engagement routes require authentication
router.use(authMiddleware);

// Engagement data logging and retrieval
router.post('/log', engagementController.logEngagementData);
router.post('/webcam', engagementController.analyzeWebcamImage);
router.post('/activity', engagementController.trackActivity);
router.get('/current/:sessionId', engagementController.getCurrentEngagement);
router.get('/timeline/:sessionId', engagementController.getEngagementTimeline);

module.exports = router;