const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploads folder static to serve images
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Seed Admin User
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
      const adminEmail = 'pramodyayasith@gmail.com';
      const adminExists = await User.findOne({ email: adminEmail });
      
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@567', salt);
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Main Admin account created successfully');
      } else if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log('Admin role updated for existing account');
      }
    } catch (error) {
      console.error('Error seeding admin:', error);
    }

    const { createServer } = require('http');
    const { Server } = require('socket.io');
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
      }
    });

    // Socket.io connection logic
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their notification room`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Make io accessible in routes
    app.set('socketio', io);

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1); // Exit process with failure
  });
