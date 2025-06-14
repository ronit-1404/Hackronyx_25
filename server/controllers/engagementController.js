const EngagementData = require('../models/EngagementData.js');
const Session = require('../models/Session.js');
const axios = require('axios');


exports.logEngagementData = async (req, res) => {
  try {
    //here this data will recived by the frontend frontend mai data python model ka route call karne par ayga
    const { 
      sessionId, 
      engagementScore, 
      attentionScore,
      emotionData,
      activityData,
      audioData,
      videoProgress
    } = req.body;
    
    const userId = req.user.userId;

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

    // Create engagement data entry
    const engagementData = new EngagementData({
      sessionId,
      timestamp: Date.now(),
      engagementScore: engagementScore || 0.5,
      attentionScore: attentionScore || null,
      emotionData: emotionData || {
        primary: 'neutral',
        confidence: 0,
        emotions: {
          confused: 0,
          engaged: 0,
          bored: 0,
          frustrated: 0,
          neutral: 1
        }
      },
      activityData: activityData || {
        mouseMovements: 0,
        keystrokes: 0,
        scrolls: 0,
        clickCount: 0,
        inactiveTime: 0
      },
      audioData: audioData || {
        speaking: false,
        speakingConfidence: 0,
        backgroundNoise: 0
      },
      videoProgress: videoProgress || {
        currentTime: 0,
        totalDuration: 0,
        percentComplete: 0
      }
    });

    await engagementData.save();

    res.status(201).json({
      success: true,
      message: 'Engagement data logged successfully',
      engagementData: {
        id: engagementData._id,
        timestamp: engagementData.timestamp,
        engagementScore: engagementData.engagementScore
      }
    });
  } catch (error) {
    console.error('Log engagement data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.analyzeWebcamImage = async (req, res) => {
  try {
    const { sessionId, imageData } = req.body;
    const userId = req.user.userId;

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

    // Send to Python service for analysis
    try {
      const response = await axios.post('http://localhost:5001/api/analyze/face', {
        userId,
        sessionId,
        imageData
      });

      const analysis = response.data.analysis;

      // Save engagement data
      if (analysis && analysis.engagement_score) {
        const engagementData = new EngagementData({
          sessionId,
          timestamp: Date.now(),
          engagementScore: analysis.engagement_score,
          attentionScore: analysis.attention_score || null,
          emotionData: {
            primary: analysis.emotion || 'neutral',
            confidence: analysis.emotion_probabilities 
              ? analysis.emotion_probabilities[analysis.emotion] || 0 
              : 0,
            emotions: analysis.emotion_probabilities || {
              neutral: 1
            }
          }
        });

        await engagementData.save();

        res.status(200).json({
          success: true,
          analysis: {
            engagementScore: analysis.engagement_score,
            attentionScore: analysis.attention_score,
            emotion: analysis.emotion,
            faceDetected: analysis.face_detected
          },
          engagementData: {
            id: engagementData._id,
            timestamp: engagementData.timestamp
          }
        });
      } else {
        res.status(200).json({
          success: true,
          analysis: {
            engagementScore: 0.5,
            attentionScore: 0,
            emotion: 'unknown',
            faceDetected: false
          }
        });
      }
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      
      // Return basic response if Python service fails
      res.status(200).json({
        success: true,
        analysis: {
          engagementScore: 0.5,
          attentionScore: 0,
          emotion: 'unknown',
          faceDetected: false,
          error: 'Analysis service unavailable'
        }
      });
    }
  } catch (error) {
    console.error('Analyze webcam image error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Track user activity from browser extension
 */
exports.trackActivity = async (req, res) => {
  try {
    const { sessionId, type, data } = req.body;
    const userId = req.user.userId;

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

    // Forward to Python service
    try {
      await axios.post('http://localhost:5001/api/analyze/activity', {
        userId,
        sessionId,
        type,
        data
      });
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      // Continue even if Python service fails
    }

    // For certain activities, we might want to save directly to MongoDB as well
    if (type === 'inactive' || type === 'video_progress') {
      // Construct activity data based on type
      const activityData = {};
      
      if (type === 'inactive') {
        activityData.inactiveTime = data.duration || 0;
      } else if (type === 'video_progress') {
        activityData.videoProgress = {
          currentTime: data.currentTime || 0,
          totalDuration: data.totalDuration || 0,
          percentComplete: data.percentComplete || 0
        };
      }

      // Create engagement data entry with focus on activity
      const engagementData = new EngagementData({
        sessionId,
        timestamp: Date.now(),
        engagementScore: type === 'inactive' ? 0.2 : 0.7,  // Inactive users have low engagement
        activityData: {
          mouseMovements: data.mouseMovements || 0,
          keystrokes: data.keystrokes || 0,
          scrolls: data.scrolls || 0,
          clickCount: data.clickCount || 0,
          inactiveTime: data.inactiveTime || 0
        }
      });

      await engagementData.save();
    }

    res.status(200).json({
      success: true,
      message: 'Activity tracked successfully'
    });
  } catch (error) {
    console.error('Track activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get current engagement level for a session
 */
exports.getCurrentEngagement = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

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

    // Get latest engagement data
    const latestData = await EngagementData.findOne({ sessionId })
      .sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(200).json({
        success: true,
        engagement: {
          score: 0.5,
          emotion: 'neutral',
          timestamp: Date.now()
        }
      });
    }

    // Try to get real-time data from Python service
    try {
      const response = await axios.get('http://localhost:5001/api/analyze/engagement', {
        params: { userId }
      });

      if (response.data && response.data.success) {
        const analysis = response.data.analysis;
        
        res.status(200).json({
          success: true,
          engagement: {
            score: analysis.overall_engagement || latestData.engagementScore,
            emotion: analysis.primary_emotion || 
              (latestData.emotionData ? latestData.emotionData.primary : 'neutral'),
            attentionScore: analysis.components?.face?.attention_score || latestData.attentionScore,
            needsIntervention: analysis.needs_intervention || false,
            suggestedIntervention: analysis.suggested_intervention,
            timestamp: Date.now()
          }
        });
        return;
      }
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      // Fall back to database data if Python service fails
    }

    // Return data from database
    res.status(200).json({
      success: true,
      engagement: {
        score: latestData.engagementScore,
        emotion: latestData.emotionData ? latestData.emotionData.primary : 'neutral',
        attentionScore: latestData.attentionScore,
        timestamp: latestData.timestamp
      }
    });
  } catch (error) {
    console.error('Get current engagement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get engagement timeline for a session
 */
exports.getEngagementTimeline = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

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

    // Get engagement data with sampling if needed
    let engagementData;
    
    // If resolution parameter is provided, sample the data
    if (req.query.resolution) {
      const resolution = parseInt(req.query.resolution);
      
      // Get all data points
      const allData = await EngagementData.find({ sessionId })
        .sort({ timestamp: 1 });
        
      // Sample data based on resolution
      engagementData = sampleEngagementData(allData, resolution);
    } else {
      // Get all data points
      engagementData = await EngagementData.find({ sessionId })
        .sort({ timestamp: 1 });
    }

    // Format response
    const timeline = engagementData.map(data => ({
      timestamp: data.timestamp,
      engagementScore: data.engagementScore,
      emotion: data.emotionData ? data.emotionData.primary : 'neutral'
    }));

    res.status(200).json({
      success: true,
      timeline
    });
  } catch (error) {
    console.error('Get engagement timeline error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Helper function to sample engagement data to a specific resolution
 */
function sampleEngagementData(data, targetPoints) {
  if (data.length <= targetPoints) {
    return data;
  }
  
  const result = [];
  const step = data.length / targetPoints;
  
  for (let i = 0; i < targetPoints; i++) {
    const index = Math.min(Math.floor(i * step), data.length - 1);
    result.push(data[index]);
  }
  
  return result;
}

//added functionality for showing the data of user in the form of graph or report 
//functionality for the dashboard
exports.getEngagementAverages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const data = await EngagementData.find({ sessionId });

    if (!data.length) {
      return res.status(200).json({ success: true, averages: null });
    }

    const totalEngagement = data.reduce((sum, d) => sum + d.engagementScore, 0);
    const avgEngagement = totalEngagement / data.length;

    const emotionCounts = {};
    data.forEach(d => {
      const emotion = d.emotionData?.primary || 'neutral';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      averages: {
        engagement: avgEngagement,
        emotionDistribution: emotionCounts
      }
    });
  } catch (error) {
    console.error('Get averages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
