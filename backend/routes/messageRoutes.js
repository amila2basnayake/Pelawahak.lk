const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all conversations for the logged in user
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find unique users that the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const conversationPartners = new Set();
    const conversations = [];

    for (const msg of messages) {
      const partnerId = msg.sender.equals(userId) ? msg.receiver : msg.sender;
      if (!conversationPartners.has(partnerId.toString())) {
        conversationPartners.add(partnerId.toString());
        
        // Get partner details
        const partner = await User.findById(partnerId).select('name email');
        conversations.push({
          partner,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unread: !msg.isRead && msg.receiver.equals(userId)
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get message history between two users
// @route   GET /api/messages/:partnerId
// @access  Private
router.get('/:partnerId', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner ID format' });
    }

    const [messages, partner] = await Promise.all([
      Message.find({
        $or: [
          { sender: userId, receiver: partnerId },
          { sender: partnerId, receiver: userId }
        ]
      }).sort({ createdAt: 1 }),
      User.findById(partnerId).select('name email')
    ]);

    if (!partner) {
      return res.status(404).json({ message: 'Chat partner not found' });
    }

    // Mark messages as read
    await Message.updateMany(
      { sender: partnerId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      partner,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Send a message (and broadcast via Socket.io)
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, content, adId, partnerId } = req.body;
    const sender = req.user._id;

    const message = await Message.create({
      sender,
      receiver,
      content,
      adId,
      partnerId
    });

    // Populate sender info for the frontend
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name');

    // Emit via Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.to(receiver.toString()).emit('receiveMessage', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
