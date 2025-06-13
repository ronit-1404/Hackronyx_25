// models/Intervention.js
const mongoose = require('mongoose');

const InterventionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['break', 'quiz', 'video', 'resource', 'reminder', 'motivation'],
    required: true
  },
  trigger: {
    type: String,
    enum: ['inactivity', 'confusion', 'boredom', 'low_engagement', 'scheduled', 'manual'],
    required: true
  },
  engagementBefore: {
    type: Number,
    default: null
  },
  engagementAfter: {
    type: Number,
    default: null
  },
  userResponse: {
    accepted: { type: Boolean, default: null }, // did the user accept the intervention?
    completionTime: { type: Number, default: null }, // time to complete in seconds
    feedback: { type: String, default: null } // any user feedback
  },
  content: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    resourceUrl: { type: String, default: null },
    // For quizzes:
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      userAnswer: Number
    }],
    score: { type: Number, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('Intervention', InterventionSchema);