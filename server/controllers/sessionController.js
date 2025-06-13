// ye below models banane hai sepreate folder banana hai and then will route it with actull routes of the functions 
const Session = require('../models/Session.js');
const EngagementData = require('../models/EngagementData.js');
const Intervention = require('../models/Intervention.js');
const axios = require('axios');


exports.startSession = async (req, res) => {
  try {
    const { courseUrl, courseName, platform, deviceInfo } = req.body;
    const userId = req.user.userId;

    const activeSession = await Session.findOne({ 
      userId, 
      isActive: true
    });

    if (activeSession) {
      activeSession.isActive = false;
      activeSession.endTime = Date.now();
      activeSession.duration = (activeSession.endTime - activeSession.startTime) / 1000; 
      await activeSession.save();
    }

    const session = new Session({
      userId,
      courseUrl,
      courseName: courseName || '',
      platform: platform || 'unknown',
      startTime: Date.now(),
      isActive: true,
      deviceInfo
    });

    await session.save();

    // Start analysis in Python service
    //below route in python should be connected here and data(session) db mai store hoga
    try {
      await axios.post('http://localhost:5001/api/analyze/start', {
        userId,
        sessionId: session._id.toString(),
        enableWebcam: true,
        enableAudio: true,
        enableActivity: true
      });
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      // Continue even if Python service fails
    }

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      session: {
        id: session._id,
        startTime: session.startTime,
        courseUrl: session.courseUrl,
        courseName: session.courseName,
        platform: session.platform
      }
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Find the session
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

    // Check if session is already ended
    if (!session.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session is already ended' 
      });
    }

    // End the session
    session.isActive = false;
    session.endTime = Date.now();
    session.duration = (session.endTime - session.startTime) / 1000; // in seconds

    // Calculate overall engagement
    //ye dashboard mai charts mai represent karna hai
    const engagementData = await EngagementData.find({ sessionId });
    if (engagementData.length > 0) {
      const totalEngagement = engagementData.reduce(
        (sum, data) => sum + data.engagementScore, 0
      );
      session.overallEngagement = totalEngagement / engagementData.length;
    }

    await session.save();

    // Stop analysis in Python service
    try {
      const pythonResponse = await axios.post('http://localhost:5001/api/analyze/stop', {
        userId,
        sessionId
      });

      // The Python service might return additional data we could use
      if (pythonResponse.data && pythonResponse.data.sessionData) {
        // Process and save additional insights if needed
      }
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      // Continue even if Python service fails
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        overallEngagement: session.overallEngagement
      }
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



//this function when called through the route getsessoindetail will display the detailed session details on the user dashboard
exports.getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Find the session
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

    // Get engagement data
    const engagementData = await EngagementData.find({ sessionId })
      .sort({ timestamp: 1 });

    // Get interventions
    const interventions = await Intervention.find({ sessionId })
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        courseUrl: session.courseUrl,
        courseName: session.courseName,
        platform: session.platform,
        overallEngagement: session.overallEngagement,
        isActive: session.isActive
      },
      engagementData: engagementData.map(data => ({
        timestamp: data.timestamp,
        engagementScore: data.engagementScore,
        attentionScore: data.attentionScore,
        emotionData: data.emotionData,
        activityData: data.activityData
      })),
      interventions: interventions.map(intervention => ({
        id: intervention._id,
        timestamp: intervention.timestamp,
        type: intervention.type,
        trigger: intervention.trigger,
        userResponse: intervention.userResponse,
        content: intervention.content
      }))
    });
  } catch (error) {
    console.error('Get session details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = { userId };
    if (req.query.platform) {
      filter.platform = req.query.platform;
    }
    if (req.query.isActive === 'true') {
      filter.isActive = true;
    } else if (req.query.isActive === 'false') {
      filter.isActive = false;
    }

    // Date range
    if (req.query.startDate) {
      filter.startTime = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      filter.endTime = { ...filter.endTime, $lte: new Date(req.query.endDate) };
    }

    // Get sessions
    const sessions = await Session.find(filter)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalCount = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        courseUrl: session.courseUrl,
        courseName: session.courseName,
        platform: session.platform,
        overallEngagement: session.overallEngagement,
        isActive: session.isActive
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get active session
 */
exports.getActiveSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find active session
    const activeSession = await Session.findOne({ 
      userId, 
      isActive: true 
    });

    if (!activeSession) {
      return res.status(404).json({
        success: false,
        message: 'No active session found'
      });
    }

    res.status(200).json({
      success: true,
      session: {
        id: activeSession._id,
        startTime: activeSession.startTime,
        courseUrl: activeSession.courseUrl,
        courseName: activeSession.courseName,
        platform: activeSession.platform,
        duration: (Date.now() - activeSession.startTime) / 1000 // current duration in seconds
      }
    });
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getSessionStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Filter by date range
    const filter = { userId };
    if (req.query.startDate) {
      filter.startTime = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      filter.endTime = { ...filter.endTime, $lte: new Date(req.query.endDate) };
    }
    
    // Get completed sessions only
    filter.isActive = false;
    
    // Get all matching sessions
    const sessions = await Session.find(filter);
    
    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalSessions: 0,
          totalDuration: 0,
          averageEngagement: 0,
          platforms: {}
        }
      });
    }
    
    // Calculate statistics
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    
    // Calculate average engagement (excluding sessions with null engagement)
    const engagementSessions = sessions.filter(s => s.overallEngagement !== null);
    const averageEngagement = engagementSessions.length > 0 
      ? engagementSessions.reduce((sum, s) => sum + s.overallEngagement, 0) / engagementSessions.length
      : 0;
    
    // Group by platform
    const platforms = {};
    sessions.forEach(session => {
      const platform = session.platform || 'unknown';
      if (!platforms[platform]) {
        platforms[platform] = {
          count: 0,
          totalDuration: 0,
          averageEngagement: 0
        };
      }
      
      platforms[platform].count++;
      platforms[platform].totalDuration += (session.duration || 0);
      
      if (session.overallEngagement !== null) {
        platforms[platform].averageEngagement = 
          ((platforms[platform].averageEngagement * (platforms[platform].count - 1)) + 
          session.overallEngagement) / platforms[platform].count;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        totalDuration,
        averageEngagement,
        platforms
      }
    });
  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};