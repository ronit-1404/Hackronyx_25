const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db/db.js');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
// Load environment variables
dotenv.config();

// Import all models to register with Mongoose
require('./models/User.js');
require('./models/Session.js');
require('./models/EngagementData.js');
require('./models/Intervention.js');
require('./models/Course.js');
require('./models/LearningResource.js');
require('./models/EngagementInsight.js');

// Import routes
//const userRoutes = require('./routes/userRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const engagementRoutes = require('./routes/engagementRoutes.js');
const extensionRoutes = require('./routes/extensionRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const screenRoutes = require('./routes/screenRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js');

// Connect to database
connectDB();


const uploadDir = path.join(__dirname, 'uploads');
const audioDir = path.join(uploadDir, 'audio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}
// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Proxy for ML service
app.use('/api/analyze', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true
}));

// Root route
app.get('/', (req, res) => {
  res.send('Learning Engagement API is running...');
});

// Routes
//app.use('/api/auth', userRoutes);

app.use(express.static('public'));

// Add these routes before your API routes
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Add this route before your API routes
app.get('/token-bridge', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'token-bridge.html'));
});

// Serve static files for the bridge
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));

app.use('/api/sessions', sessionRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/extension', extensionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/screen',screenRoutes)
app.use('/api/admin', adminRoutes);

// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle real-time engagement data
  socket.on('engagement_update', (data) => {
    socket.broadcast.emit('engagement_update', data);
  });
  
  socket.on('intervention_response', (data) => {
    console.log('Intervention response:', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});