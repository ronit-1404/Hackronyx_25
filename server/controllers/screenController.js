const Session = require('../models/Session.js')
const ScreenAnalysisData = require('../models/ScreenAnalysisData.js');
const EngagementData = require('../models/EngagementData.js')
/**
 * Save screen analyzer data from Flask API
 * This endpoint receives data from the frontend after it gets a response from the Flask API
 */
exports.saveScreenAnalysis = async (req, res) => {
  try {
    const { sessionId, screenData } = req.body;
    const userId = req.userId; // From auth middleware

    // Verify session exists and belongs to user
    const session = await Session.findOne({ 
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Check if session is active
    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot log data for inactive session'
      });
    }

    // Create screen analysis record
    const screenAnalysis = new ScreenAnalysisData({
      sessionId,
      timestamp: new Date(),
      context: screenData.context || 'unknown',
      sentiment: screenData.sentiment || 'neutral',
      activeApp: screenData.active_app || screenData.activeApp,
      idleTime: screenData.idle_time || screenData.idleTime || 0,
      textSample: screenData.text_sample || screenData.textSample,
      screenshotUrl: screenData.screenshot,
      insights: screenData.insights || [],
      recommendations: screenData.recommendations || []
    });

    await screenAnalysis.save();

    // Also create a corresponding engagement data entry to maintain consistency
    // and ensure it's included in overall engagement calculations
    let engagementScore = 0.5; // Default score

    // Calculate engagement score based on screen analysis data
    if (screenData.sentiment === 'positive') {
      engagementScore = 0.8;
    } else if (screenData.sentiment === 'negative') {
      engagementScore = 0.3;
    }

    // Adjust engagement based on idle time
    if (screenData.idle_time && screenData.idle_time > 60) {
      engagementScore *= 0.7; // Reduce engagement for longer idle times
    }
    
    // Analyze context to adjust engagement
    if (screenData.context === 'coding' || screenData.context === 'programming') {
      engagementScore *= 1.2; // Boost engagement for productive activities
    } else if (screenData.context === 'browsing' && !screenData.text_sample?.includes('educational')) {
      engagementScore *= 0.8; // Reduce for general browsing
    }
    
    // Cap the score between 0 and 1
    engagementScore = Math.max(0, Math.min(1, engagementScore));

    // Save to standard engagement data
    const engagementData = new EngagementData({
      sessionId,
      timestamp: new Date(),
      type: 'screen_analyzer',
      engagementScore,
      data: screenData,
      emotionData: {
        primary: screenData.sentiment || 'neutral',
        confidence: 0.7,
        emotions: {
          engaged: screenData.context === 'coding' ? 0.8 : 0.5,
          confused: screenData.sentiment === 'negative' ? 0.7 : 0.2,
          bored: screenData.idle_time > 90 ? 0.8 : 0.3,
          frustrated: screenData.sentiment === 'negative' ? 0.6 : 0.1,
          neutral: 0.5
        }
      },
      activityData: {
        inactiveTime: screenData.idle_time || 0
      }
    });

    await engagementData.save();

    res.status(201).json({
      success: true,
      message: 'Screen analysis data saved successfully',
      screenAnalysis: {
        id: screenAnalysis._id,
        timestamp: screenAnalysis.timestamp,
        context: screenAnalysis.context,
        engagementScore
      }
    });
  } catch (error) {
    console.error('Save screen analysis error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get screen analysis history for a session
 */
exports.getScreenAnalysisHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    // Verify session exists and belongs to user
    const session = await Session.findOne({ 
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    // Get screen analysis data with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const screenAnalysisData = await ScreenAnalysisData
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await ScreenAnalysisData.countDocuments({ sessionId });

    res.status(200).json({
      success: true,
      data: screenAnalysisData,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get screen analysis history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};