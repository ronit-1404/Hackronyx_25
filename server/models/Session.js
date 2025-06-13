// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseUrl: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  overallEngagement: {
    type: Number, // 0 to 1 score
    default: 0
  },
  platform: {
    type: String, // e.g., "youtube", "coursera"
    default: "unknown"
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);