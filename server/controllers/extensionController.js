// controllers/extensionController.js
const User = require('../models/User.js');
const Session = require('../models/Session.js');
const EngagementData = require('../models/EngagementData.js');
const Intervention = require('../models/Intervention.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

/**
 * Extension authentication
 */
exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token with longer expiry for extension
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Extension authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.initPageTracking = async (req, res) => {
  try {
    const { url, pageTitle, platform } = req.body;
    const userId = req.user.userId;
    
    // Determine platform from URL if not provided
    let detectedPlatform = platform;
    if (!detectedPlatform) {
      if (url.includes('youtube.com')) {
        detectedPlatform = 'youtube';
      } else if (url.includes('coursera.org')) {
        detectedPlatform = 'coursera';
      } else if (url.includes('udemy.com')) {
        detectedPlatform = 'udemy';
      } else {
        detectedPlatform = 'other';
      }
    }
    
    // Check if there's an active session for this user
    let activeSession = await Session.findOne({ 
      userId, 
      isActive: true 
    });
    
    // If active session exists for a different URL, end it
    if (activeSession && activeSession.courseUrl !== url) {
      activeSession.isActive = false;
      activeSession.endTime = Date.now();
      activeSession.duration = (activeSession.endTime - activeSession.startTime) / 1000; // in seconds
      
      // Calculate overall engagement
      const engagementData = await EngagementData.find({ sessionId: activeSession._id });
      if (engagementData.length > 0) {
        const totalEngagement = engagementData.reduce((sum, data) => sum + data.engagementScore, 0);
        activeSession.overallEngagement = totalEngagement / engagementData.length;
      }
      
      await activeSession.save();
      activeSession = null;
    }
    
    // Start new session if needed
    if (!activeSession) {
      // Create new session
      const session = new Session({
        userId,
        courseUrl: url,
        courseName: pageTitle || '',
        platform: detectedPlatform,
        startTime: Date.now(),
        isActive: true,
        deviceInfo: req.body.deviceInfo || {}
      });
      
      await session.save();
      activeSession = session;
      
      // Start analysis in Python service
      try {
        await axios.post('http://localhost:5001/api/analyze/start', {
          userId,
          sessionId: session._id.toString(),
          enableWebcam: req.body.enableWebcam || true,
          enableAudio: req.body.enableAudio || true,
          enableActivity: true
        });
      } catch (pythonError) {
        console.error('Python service error:', pythonError);
        // Continue even if Python service fails
      }
    }
    
    // Update URL info for Python service
    try {
      await axios.post('http://localhost:5001/api/analyze/activity', {
        userId,
        type: 'url_change',
        data: {
          url,
          title: pageTitle
        }
      });
    } catch (pythonError) {
      console.error('Python service URL update error:', pythonError);
    }
    
    res.status(200).json({
      success: true,
      session: {
        id: activeSession._id,
        courseUrl: activeSession.courseUrl,
        courseName: activeSession.courseName,
        platform: activeSession.platform,
        startTime: activeSession.startTime
      }
    });
  } catch (error) {
    console.error('Init page tracking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.batchActivityData = async (req, res) => {
  try {
    const { sessionId, activities } = req.body;
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
    
    // Process each activity
    const processPromises = activities.map(async (activity) => {
      try {
        // Send to Python service
        await axios.post('http://localhost:5001/api/analyze/activity', {
          userId,
          sessionId,
          type: activity.type,
          data: activity.data
        });
        
        return true;
      } catch (error) {
        console.error('Python activity processing error:', error);
        return false;
      }
    });
    
    await Promise.all(processPromises);
    
    // Create a summary engagement data entry
    // This avoids creating too many database records
    if (activities.length > 0) {
      // Calculate average engagement score from activities
      // For simplicity we're using a default score here
      const engagementData = new EngagementData({
        sessionId,
        timestamp: Date.now(),
        engagementScore: 0.7, // Default score, in reality this would be calculated
        activityData: {
          mouseMovements: activities.filter(a => a.type === 'mouse_move').length,
          keystrokes: activities.filter(a => a.type === 'keystroke').length,
          scrolls: activities.filter(a => a.type === 'scroll').length,
          clickCount: activities.filter(a => a.type === 'click').length,
          inactiveTime: activities.some(a => a.type === 'inactive') ? 
            activities.find(a => a.type === 'inactive').data.duration : 0
        }
      });
      
      await engagementData.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Activities processed successfully',
      processedCount: activities.length
    });
  } catch (error) {
    console.error('Batch activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.checkIntervention = async (req, res) => {
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

    // Check if session is active
    if (!session.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check interventions for inactive session'
      });
    }
    
    // Find the last intervention for this session
    const lastIntervention = await Intervention.findOne({ sessionId })
      .sort({ timestamp: -1 });
    
    // Don't suggest too frequent interventions
    if (lastIntervention && 
        Date.now() - lastIntervention.timestamp < 3 * 60 * 1000) { // 3 minutes
      return res.status(200).json({
        success: true,
        needsIntervention: false,
        message: 'Too soon for another intervention'
      });
    }
    
    // Check with Python service
    try {
      const response = await axios.get('http://localhost:5001/api/analyze/engagement', {
        params: { userId }
      });
      
      if (response.data && response.data.success) {
        const analysis = response.data.analysis;
        
        // If intervention is needed
        if (analysis.needs_intervention) {
          // Get the appropriate intervention
          const interventionType = analysis.suggested_intervention || 'quiz';
          
          // Generate intervention content
          // This would typically call a more sophisticated service
          const interventionContent = generateBasicIntervention(interventionType, session);
          
          // Create intervention record
          const intervention = new Intervention({
            sessionId,
            timestamp: Date.now(),
            type: interventionType,
            trigger: analysis.components?.activity?.is_inactive ? 'inactivity' : 
                     (analysis.primary_emotion === 'confused' ? 'confusion' : 'low_engagement'),
            engagementBefore: analysis.overall_engagement,
            content: interventionContent
          });
          
          await intervention.save();
          
          return res.status(200).json({
            success: true,
            needsIntervention: true,
            intervention: {
              id: intervention._id,
              type: intervention.type,
              content: intervention.content
            }
          });
        }
      }
      
      // Default response - no intervention needed
      return res.status(200).json({
        success: true,
        needsIntervention: false
      });
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      
      // If Python service fails, fall back to a simple time-based check
      if (lastIntervention) {
        return res.status(200).json({
          success: true,
          needsIntervention: false
        });
      } else {
        // If no interventions yet, suggest one anyway
        const intervention = new Intervention({
          sessionId,
          timestamp: Date.now(),
          type: 'quiz',
          trigger: 'scheduled',
          engagementBefore: 0.5,
          content: generateBasicIntervention('quiz', session)
        });
        
        await intervention.save();
        
        return res.status(200).json({
          success: true,
          needsIntervention: true,
          intervention: {
            id: intervention._id,
            type: intervention.type,
            content: intervention.content
          }
        });
      }
    }
  } catch (error) {
    console.error('Check intervention error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// function generateBasicIntervention(type, session) {
//   switch(type) {
//     case 'break':
//       return {
//         title: 'Time for a Quick Break',
//         description: 'You\'ve been studying for a while. Take 5 minutes to refresh.',
//         actions: ['accept', 'dismiss'],
//         duration: 300
//       };
      
//     case 'quiz':
//       return {
//         title: 'Quick Knowledge Check',
//         description: 'Let\'s see what you remember from this material:',
//         questions: [
//           {
//             question: 'What was the main topic covered in this section?',
//             options: ['Option A', 'Option B', 'Option C', 'Option D'],
//             correctAnswer: 0
//           },
//           {
//             question: 'How well do you understand the material so far?',
//             options: ['Very well', 'Somewhat', 'Not very well', 'Not at all'],
//             correctAnswer: null  // Self-assessment question
//           }
//         ],
//         actions: ['submit', 'dismiss']
//       };
      
//     case 'video':
//       return {
//         title: 'Need a Different Perspective?',
//         description: 'Here\'s a short video that explains this concept differently:',
//         videoUrl: 'https://example.com/sample-video',
//         duration: 180,
//         actions: ['watch', 'dismiss']
//       };
      
//     case 'resource':
//       return {
//         title: 'Having Trouble?',
//         description: 'Check out these helpful resources:',
//         links: [
//           {text: 'Concept Explanation', url: 'https://example.com/concept'},
//           {text: 'Interactive Tutorial', url: 'https://example.com/tutorial'}
//         ],
//         actions: ['view', 'dismiss']
//       };
      
//     default:
//       return {
//         title: 'Quick Check-in',
//         description: 'How are you doing with this material?',
//         actions: ['good', 'need_help', 'dismiss']
//       };
//   }
// }


exports.logError = async (req, res) => {
  try {
    const { message, stack, context } = req.body;
    
    // Log the error to your server logs
    console.error('Extension error:', {
      userId: req.user?.userId || 'unauthenticated',
      message,
      stack,
      context,
      timestamp: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Error logged successfully'
    });
  } catch (error) {
    console.error('Error logging error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};