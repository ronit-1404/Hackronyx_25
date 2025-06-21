const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController.js');
const authMiddleware = require('../middleware/auth.js')
const screenController = require('../controllers/screenController.js')


router.post('/screen-analysis', screenController.saveScreenAnalysis);
router.get('/screen-analysis/history/:sessionId',  screenController.getScreenAnalysisHistory);


module.exports = router;