
const mongoose = require('mongoose');

const EngagementInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'overall'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    averageEngagement: { type: Number, default: 0 },
    totalSessionTime: { type: Number, default: 0 }, 
    sessionsCount: { type: Number, default: 0 },
    mostEngagedTimeOfDay: { type: String, default: null }, 
    mostEngagedDayOfWeek: { type: Number, default: null }, 
    mostFrequentEmotion: { type: String, default: null },
    emotionDistribution: {
      engaged: { type: Number, default: 0 },
      confused: { type: Number, default: 0 },
      bored: { type: Number, default: 0 },
      frustrated: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 }
    },
    interventionEffectiveness: { type: Number, default: 0 }, 
    mostEffectiveInterventionType: { type: String, default: null }
  },
  recommendations: [{
    type: String
  }]
}, { timestamps: true });

EngagementInsightSchema.index({ userId: 1, period: 1, date: 1 });

module.exports = mongoose.model('EngagementInsight', EngagementInsightSchema);