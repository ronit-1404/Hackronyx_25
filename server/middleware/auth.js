const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Get token from header or query parameters
    const token = req.header('token') || req.query.token;
    
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set userId in request object
      req.userId = decoded.userId;
      
      console.log(`Authentication successful for user: ${req.userId}`);
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};