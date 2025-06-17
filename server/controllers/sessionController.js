// ye below models banane hai sepreate folder banana hai and then will route it with actull routes of the functions 
const Session = require('../models/Session.js');
const EngagementData = require('../models/EngagementData.js');
const Intervention = require('../models/Intervention.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');


  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../uploads/audio');
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });


exports.startSession = async (req, res) => {
  try {
    console.log('Start session request. User ID:', req.userId);
    if (!req.userId) {
      console.error('Session creation failed: No user ID found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    const { courseUrl, courseName, platform, deviceInfo } = req.body;
    //const userId = req.user.userId;
    const userId = req.userId;

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
    const userId = req.userId;

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
    //will implement it later if the consistancy is obtained
    // if (!session.isActive) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Session is already ended' 
    //   });
    // }

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
    // Debug logging
    console.log('Get user sessions request. Headers:', req.headers);
    console.log('User ID from request:', req.userId);
    
    // Validate userId exists
    if (!req.userId) {
      console.error('User ID missing in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Get query parameters with defaults
    const { 
      limit = 10, 
      page = 1,
      sortBy = 'startTime',
      sortDir = 'desc',
      status
    } = req.query;
    
    // Build query
    const query = { userId: req.userId };
    
    // Filter by status if provided
    if (status === 'active') {
      query.active = true;
    } else if (status === 'completed') {
      query.active = false;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine sort direction
    const sortDirection = sortDir === 'asc' ? 1 : -1;
    
    // Query sessions
    const sessions = await Session.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Convert to plain JS objects for better performance
    
    // Get total count for pagination
    const totalSessions = await Session.countDocuments(query);
    
    return res.json({
      success: true,
      count: sessions.length,
      total: totalSessions,
      page: parseInt(page),
      totalPages: Math.ceil(totalSessions / parseInt(limit)),
      sessions: sessions
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
/**
 * Get active session
 */
exports.getActiveSession = async (req, res) => {
  try {
    const userId = req.userId;

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
    const userId = req.userId;
    
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


// Add this function to your existing file
exports.checkSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Validate session ID
    if (!sessionId || sessionId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID',
        active: false
      });
    }
    
    // Find the session
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.json({
        success: true,
        active: false,
        message: 'Session not found'
      });
    }
    
    // Check if session belongs to user
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this session',
        active: false
      });
    }
    
    // Return session status
    return res.json({
      success: true,
      active: session.isActive,
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        isActive: session.isActive,
        courseUrl: session.courseUrl,
        courseName: session.courseName
      }
    });
  } catch (error) {
    console.error('Check session status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      active: false
    });
  }
};

  exports.uploadAudio = [
    upload.single('audio'),
    async (req, res) => {
      try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
          return res.status(400).json({
            success: false,
            message: 'Session ID required'
          });
        }
        
        // Check if session exists
        const session = await Session.findById(sessionId);
        if (!session) {
          return res.status(404).json({
            success: false,
            message: 'Session not found'
          });
        }
        
        // Verify user owns the session
        if (session.userId.toString() !== req.userId) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized'
          });
        }
        
        // Check if file was uploaded
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No audio file provided'
          });
        }
        
        // Save metadata to database
        const audioData = new EngagementData({
          sessionId,  // Make sure this matches your schema (sessionId vs session)
          type: 'audio_file',
          data: {
            fileName: req.file.filename,
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size
          },
          timestamp: new Date()
        });
        
        await audioData.save();
        
        // Try to send to ML service for analysis if enabled
        if (process.env.ML_SERVICE_ENABLED === 'true') {
          try {
            // Create form data for ML service
            const formData = new FormData();
            formData.append('audio', fs.createReadStream(req.file.path));
            formData.append('sessionId', sessionId);
            
            // Send to ML service asynchronously
            axios.post('http://localhost:5001/api/analyze/audio', formData, {
              headers: formData.getHeaders()
            }).catch(err => console.log('ML audio analysis error (non-critical):', err.message));
          } catch (mlError) {
            console.log('Failed to send audio to ML service:', mlError);
            // Continue anyway
          }
        }
        
        return res.json({
          success: true,
          message: 'Audio uploaded successfully',
          audioId: audioData._id
        });
      } catch (error) {
        console.error('Audio upload error:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }
    }
  ];

  exports.getAudioMetrics = async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Validate session ID
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID required'
        });
      }
      
      // Check if session exists and belongs to user
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
      
      if (session.userId.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }
      
      // Get audio metrics from engagement data
      const audioData = await EngagementData.find({
        sessionId,  // Make sure this matches your schema (sessionId vs session)
        type: 'audio'
      }).sort('timestamp');
      
      // Process metrics
      const metrics = {
        average: 0,
        timeline: [],
        emotions: {}
      };
      
      let totalScore = 0;
      
      audioData.forEach(item => {
        // Add to timeline
        metrics.timeline.push({
          timestamp: item.timestamp,
          engagementScore: item.data.engagementScore || 0
        });
        
        // Track total for average
        totalScore += (item.data.engagementScore || 0);
        
        // Track emotions
        if (item.data.emotion && item.data.emotion !== 'unknown') {
          metrics.emotions[item.data.emotion] = (metrics.emotions[item.data.emotion] || 0) + 1;
        }
      });
      
      // Calculate average
      metrics.average = audioData.length > 0 ? totalScore / audioData.length : 0;
      
      return res.json({
        success: true,
        metrics
      });
    } catch (error) {
      console.error('Get audio metrics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };