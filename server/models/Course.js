// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  progress: {
    type: Number, // 0-100 percentage
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: null
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  averageEngagement: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);