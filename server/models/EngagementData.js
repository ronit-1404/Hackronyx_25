// models/EngagementData.js
const mongoose = require('mongoose');

const EngagementDataSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  engagementScore: {
    type: Number, // 0 to 1 score
    required: true
  },
  attentionScore: {
    type: Number, // 0 to 1 score
    default: null
  },
  emotionData: {
    primary: {
      type: String, // e.g., "neutral", "confused", "engaged", "bored"
      default: "neutral"
    },
    confidence: {
      type: Number, // 0 to 1
      default: 0
    },
    emotions: {
      confused: { type: Number, default: 0 },
      engaged: { type: Number, default: 0 },
      bored: { type: Number, default: 0 },
      frustrated: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 }
    }
  },
  activityData: {
    mouseMovements: { type: Number, default: 0 },
    keystrokes: { type: Number, default: 0 },
    scrolls: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    inactiveTime: { type: Number, default: 0 } // in seconds
  },
  audioData: {
    speaking: { type: Boolean, default: false },
    speakingConfidence: { type: Number, default: 0 },
    backgroundNoise: { type: Number, default: 0 }
  },
  videoProgress: {
    currentTime: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    percentComplete: { type: Number, default: 0 }
  }
});

// Index for efficient queries by session
EngagementDataSchema.index({ sessionId: 1, timestamp: 1 });

module.exports = mongoose.model('EngagementData', EngagementDataSchema);