const Admin = require('../models/Admin.js')
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


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