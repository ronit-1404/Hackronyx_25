// models/LearningResource.js
const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  resourceType: {
    type: String,
    enum: ['video', 'quiz', 'article', 'game', 'exercise', 'break'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  tags: [{
    type: String
  }],
  metadata: {
    author: String,
    source: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  engagementScore: {
    type: Number, // average engagement score from users
    default: 0
  },
  useCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LearningResource', LearningResourceSchema);