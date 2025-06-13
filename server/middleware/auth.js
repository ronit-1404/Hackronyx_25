const jwt = require('jsonwebtoken');

const authMiddleware  = (req, res, next) => {
  try {
    //const token = req.header('token');

    //if below did'nt work use the above one
    const {token} = req.headers    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID from the token to the request body
    //req.body.userId = decodedToken.id;


    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = authMiddleware;