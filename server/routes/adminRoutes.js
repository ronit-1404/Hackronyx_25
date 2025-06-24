const express = require('express');
const router = express.Router()
const adminController = require('../controllers/adminController.js')

router.get('/students', adminController.getAllStudents);
router.get('/students/:id', adminController.getStudentById);
router.get('/students/:id/analytics', adminController.getStudentAnalytics);

module.exports = router;