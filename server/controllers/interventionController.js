const Intervention = require('../models/Intervention.js');
const Session = require('../models/Session.js');
const LearningResource = require('../models/LearningResource.js');
const axios = require('axios');


exports.getSuggestion = async (req, res) => {
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
        message: 'Cannot suggest interventions for inactive session'
      });
    }

    // Get suggestion from Python service
    let interventionType;
    let analysis;

    try {
      // Get current engagement analysis
      const response = await axios.get('http://localhost:5001/api/analyze/engagement', {
        params: { userId }
      });

      if (response.data && response.data.success) {
        analysis = response.data.analysis;
        
        // Check if intervention is needed
        if (!analysis.needs_intervention) {
          return res.status(200).json({
            success: true,
            needsIntervention: false,
            message: 'No intervention needed at this time'
          });
        }
        
        interventionType = analysis.suggested_intervention;
      }
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      // If Python service fails, choose a default intervention
      interventionType = 'quiz';
    }
    
    // If no type was determined, default to quiz
    if (!interventionType) {
      interventionType = 'quiz';
    }
    
    // Get appropriate resources based on intervention type
    let content;
    
    switch (interventionType) {
      case 'break':
        content = {
          title: 'Time for a Quick Break',
          description: 'You\'ve been studying for a while. Take 5 minutes to refresh.',
          duration: 300, // 5 minutes
        };
        break;
        
      case 'quiz':
        // Try to find relevant quiz for the course
        const quiz = await LearningResource.findOne({
          resourceType: 'quiz',
          tags: { $regex: new RegExp(session.courseName || '', 'i') }
        });
        
        content = quiz ? {
          title: quiz.title,
          description: quiz.description,
          questions: quiz.metadata.questions || []
        } : {
          title: 'Quick Knowledge Check',
          description: 'Let\'s see what you remember from this section:',
          questions: [
            {
              question: 'What was the main topic covered in this section?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0
            }
          ]
        };
        break;
        
      case 'video':
        // Try to find relevant video resources
        const video = await LearningResource.findOne({
          resourceType: 'video',
          tags: { $regex: new RegExp(session.courseName || '', 'i') }
        });
        
        content = video ? {
          title: video.title,
          description: video.description,
          url: video.url,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl
        } : {
          title: 'Take a Different Approach',
          description: 'Here\'s a short video that explains this concept differently:',
          url: 'https://example.com/sample-video',
          duration: 180
        };
        break;
        
      case 'resource':
        // Find relevant resources
        const resources = await LearningResource.find({
          resourceType: { $in: ['article', 'exercise'] },
          tags: { $regex: new RegExp(session.courseName || '', 'i') }
        }).limit(2);
        
        content = resources.length > 0 ? {
          title: 'Need More Help?',
          description: 'Check out these resources:',
          resources: resources.map(r => ({
            title: r.title,
            description: r.description,
            url: r.url,
            type: r.resourceType
          }))
        } : {
          title: 'Additional Resources',
          description: 'Here are some resources that might help:',
          resources: [
            {
              title: 'Sample Resource',
              description: 'A helpful explanation of this concept',
              url: 'https://example.com/resource',
              type: 'article'
            }
          ]
        };
        break;
        
      default:
        content = {
          title: 'Quick Check-in',
          description: 'How are you doing with this material?',
          options: ['Good, continuing', 'Need a break', 'Finding it difficult']
        };
    }

    // Create intervention record
    const intervention = new Intervention({
      sessionId,
      timestamp: Date.now(),
      type: interventionType,
      trigger: analysis ? analysis.components?.activity?.is_inactive ? 'inactivity' : 
               (analysis.primary_emotion === 'confused' ? 'confusion' : 'low_engagement')
               : 'low_engagement',
      engagementBefore: analysis ? analysis.overall_engagement : 0.5,
      content: {
        title: content.title,
        description: content.description,
        ...content
      }
    });

    await intervention.save();

    res.status(200).json({
      success: true,
      needsIntervention: true,
      intervention: {
        id: intervention._id,
        type: intervention.type,
        timestamp: intervention.timestamp,
        content: intervention.content
      }
    });
  } catch (error) {
    console.error('Get suggestion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Record user response to an intervention
 */
exports.recordResponse = async (req, res) => {
  try {
    const { interventionId } = req.params;
    const { accepted, completionTime, feedback, answer } = req.body;
    const userId = req.user.userId;

    // Find the intervention
    const intervention = await Intervention.findById(interventionId);
    
    if (!intervention) {
      return res.status(404).json({ 
        success: false, 
        message: 'Intervention not found' 
      });
    }

    // Verify the session belongs to the user
    const session = await Session.findOne({ 
      _id: intervention.sessionId,
      userId
    });

    if (!session) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Update intervention with user response
    intervention.userResponse = {
      accepted: accepted !== undefined ? accepted : intervention.userResponse?.accepted,
      completionTime: completionTime || intervention.userResponse?.completionTime,
      feedback: feedback || intervention.userResponse?.feedback
    };

    // For quizzes, record the answer
    if (intervention.type === 'quiz' && answer !== undefined) {
      if (!intervention.content.score) {
        intervention.content.score = 0;
      }
      
      // Calculate score if answers are provided
      if (Array.isArray(answer) && intervention.content.questions) {
        let correctCount = 0;
        
        answer.forEach((ans, index) => {
          if (index < intervention.content.questions.length) {
            intervention.content.questions[index].userAnswer = ans;
            
            if (ans === intervention.content.questions[index].correctAnswer) {
              correctCount++;
            }
          }
        });
        
        intervention.content.score = intervention.content.questions.length > 0 
          ? correctCount / intervention.content.questions.length 
          : 0;
      }
    }

    // Get current engagement
    try {
      const response = await axios.get('http://localhost:5001/api/analyze/engagement', {
        params: { userId }
      });
      
      if (response.data && response.data.success) {
        intervention.engagementAfter = response.data.analysis.overall_engagement;
      }
    } catch (error) {
      console.error('Python service error:', error);
    }

    await intervention.save();

    // Inform Python service about the intervention response
    try {
      await axios.post('http://localhost:5001/api/intervention/respond', {
        userId,
        interventionId: intervention._id.toString(),
        response: accepted ? 'accept' : 'dismiss'
      });
    } catch (error) {
      console.error('Python service error:', error);
    }

    res.status(200).json({
      success: true,
      message: 'Response recorded successfully',
      intervention: {
        id: intervention._id,
        type: intervention.type,
        userResponse: intervention.userResponse,
        score: intervention.content.score
      }
    });
  } catch (error) {
    console.error('Record response error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getInterventionHistory = async (req, res) => {
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

    // Get interventions for the session
    const interventions = await Intervention.find({ sessionId })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      interventions: interventions.map(i => ({
        id: i._id,
        type: i.type,
        timestamp: i.timestamp,
        trigger: i.trigger,
        engagementBefore: i.engagementBefore,
        engagementAfter: i.engagementAfter,
        userResponse: i.userResponse,
        content: {
          title: i.content.title,
          description: i.content.description
        }
      }))
    });
  } catch (error) {
    console.error('Get intervention history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getInterventionStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get completed interventions with responses
    const interventions = await Intervention.find()
      .populate({
        path: 'sessionId',
        match: { userId },
        select: 'userId'
      })
      .exec();

    // Filter out interventions from other users
    const userInterventions = interventions.filter(i => i.sessionId && i.sessionId.userId);

    if (userInterventions.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalInterventions: 0,
          responseRate: 0,
          effectivenessScore: 0,
          typeBreakdown: {}
        }
      });
    }

    // Calculate statistics
    const totalInterventions = userInterventions.length;
    
    // Response rate
    const respondedInterventions = userInterventions.filter(i => 
      i.userResponse && i.userResponse.accepted !== undefined);
      
    const responseRate = respondedInterventions.length / totalInterventions;
    
    // Accepted rate
    const acceptedInterventions = respondedInterventions.filter(i => i.userResponse.accepted);
    const acceptanceRate = respondedInterventions.length > 0 
      ? acceptedInterventions.length / respondedInterventions.length
      : 0;
    
    // Effectiveness (engagement change)
    const interventionsWithEngagementData = userInterventions.filter(i => 
      i.engagementBefore !== null && i.engagementAfter !== null);
      
    let effectivenessScore = 0;
    
    if (interventionsWithEngagementData.length > 0) {
      const totalEngagementChange = interventionsWithEngagementData.reduce((sum, i) => 
        sum + (i.engagementAfter - i.engagementBefore), 0);
        
      effectivenessScore = totalEngagementChange / interventionsWithEngagementData.length;
    }
    
    // Type breakdown
    const typeBreakdown = {};
    
    userInterventions.forEach(i => {
      if (!typeBreakdown[i.type]) {
        typeBreakdown[i.type] = {
          count: 0,
          acceptanceRate: 0,
          effectivenessScore: 0
        };
      }
      
      typeBreakdown[i.type].count++;
      
      // Calculate acceptance rate for this type
      const typeResponded = userInterventions.filter(int => 
        int.type === i.type && int.userResponse && int.userResponse.accepted !== undefined);
        
      if (typeResponded.length > 0) {
        const typeAccepted = typeResponded.filter(int => int.userResponse.accepted);
        typeBreakdown[i.type].acceptanceRate = typeAccepted.length / typeResponded.length;
      }
      
      // Calculate effectiveness for this type
      const typeWithEngagement = userInterventions.filter(int => 
        int.type === i.type && int.engagementBefore !== null && int.engagementAfter !== null);
        
      if (typeWithEngagement.length > 0) {
        const typeEngagementChange = typeWithEngagement.reduce((sum, int) => 
          sum + (int.engagementAfter - int.engagementBefore), 0);
          
        typeBreakdown[i.type].effectivenessScore = typeEngagementChange / typeWithEngagement.length;
      }
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalInterventions,
        responseRate,
        acceptanceRate,
        effectivenessScore,
        typeBreakdown
      }
    });
  } catch (error) {
    console.error('Get intervention stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getLearningResources = async (req, res) => {
  try {
    // Filtering
    const filter = {};
    
    if (req.query.type) {
      filter.resourceType = req.query.type;
    }
    
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get resources
    const resources = await LearningResource.find(filter)
      .sort({ engagementScore: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get total count
    const totalCount = await LearningResource.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      resources: resources.map(r => ({
        id: r._id,
        title: r.title,
        description: r.description,
        resourceType: r.resourceType,
        url: r.url,
        thumbnailUrl: r.thumbnailUrl,
        duration: r.duration,
        tags: r.tags,
        metadata: r.metadata,
        engagementScore: r.engagementScore
      })),
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get learning resources error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};