const Admin = require('../models/Admin.js')
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/User.js')

const generatetoken = (user, role) => {
    return jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1d" });
};


exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password, adminid } = req.body;

        if (!name || !email || !password || !adminid) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        const admin1 = await Admin.findOne({ email });
        if (admin1) {
            return res.status(400).json({ 
                success: false,
                message: "Admin already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create with new schema structure
        const admin = new Admin({ 
            name, 
            email, 
            password: hashedPassword,
            adminid
        });

        await admin.save();
        const token = generatetoken(admin, "aToken");

        res.header("Authorization", `Bearer ${token}`)
           .status(201)
           .json({ 
               success: true,
               message: "Admin registered successfully", 
               token 
            });
    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error in admin signup", 
            error: error.message 
        });
    }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }
    
    // Find admin with standalone model
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
    
    // Compare passwords (regular await instead of callback)
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    
    // Generate token
    const token = generatetoken(admin, "admin");
    
    // Return successful response
    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token: token
    });
    
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in admin login",
      error: error.message
    });
  }
};



exports.getAllStudents = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Find students with pagination
        const students = await User.find()
        
        // Get total count for pagination
        const total = await User.countDocuments(query);
        
        // Calculate engagement scores and format student data
        const formattedStudents = students.map(student => {
            // This would normally come from engagement data in a real app
            // For demo, we'll generate a random engagement score
            const engagementScore = Math.floor(75 + Math.random() * 25) + '%';
            
            // Generate some sample tags
            const subjectTags = ['Math', 'Science', 'History', 'English', 'Computer Science', 'Art', 'Physics', 'Chemistry'];
            const activityTags = ['Problem Solving', 'Reading', 'Quiz', 'Project', 'Research', 'Discussion', 'Video Lecture', 'Coding'];
            
            // Randomly select 2-3 tags
            const lastSessionTags = [];
            lastSessionTags.push(subjectTags[Math.floor(Math.random() * subjectTags.length)]);
            lastSessionTags.push(activityTags[Math.floor(Math.random() * activityTags.length)]);
            if (Math.random() > 0.5) {
                lastSessionTags.push(activityTags[Math.floor(Math.random() * activityTags.length)]);
            }
            
            return {
                id: student._id,
                name: student.name,
                email: student.email,
                photo: student.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(student.name)}`,
                engagement: engagementScore,
                lastSessionTags: lastSessionTags,
                parentLinked: Math.random() > 0.3, // Random boolean for demo
                createdAt: student.createdAt
            };
        });
        
        res.status(200).json({
            success: true,
            count: formattedStudents.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            students: formattedStudents
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching students",
            error: error.message
        });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await User.findById(id)
            .select('email name profilePicture preferences createdAt');
            
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        
        res.status(200).json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                photo: student.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(student.name)}`,
                preferences: student.preferences,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching student",
            error: error.message
        });
    }
};

exports.getStudentAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if student exists
        const student = await User.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        
        // In a real implementation, you would fetch actual analytics data
        // For demo, we'll return mock data
        const analytics = {
            engagementTrend: [
                { date: '2025-06-17', score: 82 },
                { date: '2025-06-18', score: 78 },
                { date: '2025-06-19', score: 85 },
                { date: '2025-06-20', score: 90 },
                { date: '2025-06-21', score: 88 },
                { date: '2025-06-22', score: 92 },
                { date: '2025-06-23', score: 95 }
            ],
            topSubjects: [
                { subject: 'Mathematics', score: 94 },
                { subject: 'Physics', score: 88 },
                { subject: 'Computer Science', score: 96 },
                { subject: 'English', score: 82 }
            ],
            sessionBreakdown: {
                totalTime: '28h 15m',
                sessionsCompleted: 42,
                averageSessionLength: '45m'
            },
            interventions: {
                total: 15,
                effective: 12,
                ineffective: 3
            }
        };
        
        res.status(200).json({
            success: true,
            studentId: id,
            studentName: student.name,
            analytics
        });
    } catch (error) {
        console.error("Error fetching student analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching student analytics",
            error: error.message
        });
    }
};