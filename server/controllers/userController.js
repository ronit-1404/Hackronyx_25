const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.register = async (req,res) => {
    try {
        const {name,email,password} = req.body;

        const exist = await User.findOne({email});
        if(exist){
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        const user = new User({
            name,email,password,
            preferences: {
                allowWebcam: true,
                allowAudio: true,
                allowActivityTracking: true,
                interventionFrequency: 'medium'
            }
        })

        await user.save();
        
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '2d'}
        
        )

        res.status(201).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            preferences: user.preferences
        }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


exports.login = async (req, res) => {
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

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // FIXED: Changed id to _id to match what the extension expects
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,  // Changed from id to _id
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // CORRECT: Using req.userId as set by auth middleware
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // FIXED: Change id to _id for consistency
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Validate preferences
    const validKeys = ['allowWebcam', 'allowAudio', 'allowActivityTracking', 'interventionFrequency'];
    const validFrequencies = ['low', 'medium', 'high'];
    
    // Check if preferences are valid
    if (preferences) {
      Object.keys(preferences).forEach(key => {
        if (!validKeys.includes(key)) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid preference key: ${key}` 
          });
        }
        
        if (key === 'interventionFrequency' && !validFrequencies.includes(preferences[key])) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid value for interventionFrequency` 
          });
        }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { preferences: { ...req.body.preferences } } },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};