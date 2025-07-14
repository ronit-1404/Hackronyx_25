// models/Parent.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ParentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: false
    },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber:{
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Password hashing middleware
ParentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
ParentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Parent', ParentSchema);