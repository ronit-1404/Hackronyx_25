const mongoose = require('mongoose');

const ScreenAnalysisDataSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  context: {
    type: String,
    default: 'unknown'
  },
  sentiment: {
    type: String,
    default: 'neutral'
  },
  activeApp: {
    type: String
  },
  idleTime: {
    type: Number,
    default: 0
  },
  textSample: {
    type: String
  },
  screenshotUrl: {
    type: String
  },
  insights: [{
    type: String
  }],
  engagementScore: {
    type: Number,
    default: 0.5
  },
  recommendations: [{
    title: String,
    url: String,
    reason: String,
    contentType: String,
    lengthMinutes: Number
  }]
}, { timestamps: true });

ScreenAnalysisDataSchema.index({ sessionId: 1, timestamp: 1 });

module.exports = mongoose.model('ScreenAnalysisData', ScreenAnalysisDataSchema);