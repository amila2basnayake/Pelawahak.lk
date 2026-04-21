const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const Partner = require('../models/Partner');
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/authMiddleware');

// --- AD MANAGEMENT ---

// @desc    Get all ads (including pending/rejected)
// @route   GET /api/admin/ads
// @access  Private/Admin
router.get('/ads', protect, admin, async (req, res) => {
  try {
    const ads = await Ad.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Approve an ad
// @route   PUT /api/admin/ads/:id/approve
// @access  Private/Admin
router.put('/ads/:id/approve', protect, admin, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (ad) {
      ad.status = 'approved';
      const updatedAd = await ad.save();

      // Send automated approval message
      const systemMessage = await Message.create({
        sender: req.user._id, // Admin
        receiver: ad.user,
        content: `Congratulations! Your ad "${ad.title}" has been approved and is now live on Pelawahak.lk.`,
        adId: ad._id
      });

      // Emit via Socket.io
      const io = req.app.get('socketio');
      if (io) {
        const populatedMessage = await Message.findById(systemMessage._id).populate('sender', 'name');
        io.to(ad.user.toString()).emit('receiveMessage', populatedMessage);
      }

      res.json(updatedAd);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Reject an ad
// @route   PUT /api/admin/ads/:id/reject
// @access  Private/Admin
router.put('/ads/:id/reject', protect, admin, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (ad) {
      ad.status = 'rejected';
      const updatedAd = await ad.save();
      res.json(updatedAd);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete an ad
// @route   DELETE /api/admin/ads/:id
// @access  Private/Admin
router.delete('/ads/:id', protect, admin, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (ad) {
      res.json({ message: 'Ad permanently removed' });
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- PARTNER PROFILE MANAGEMENT ---

// @desc    Get all partner profiles
// @route   GET /api/admin/partners
// @access  Private/Admin
router.get('/partners', protect, admin, async (req, res) => {
  try {
    const partners = await Partner.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Approve a partner profile
// @route   PUT /api/admin/partners/:id/approve
// @access  Private/Admin
router.put('/partners/:id/approve', protect, admin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (partner) {
      partner.status = 'approved';
      await partner.save();

      // Send automated approval message
      const systemMessage = await Message.create({
        sender: req.user._id, // Admin
        receiver: partner.user,
        content: `Your marriage proposal "${partner.title}" has been approved. You can now receive messages from potential matches.`,
        partnerId: partner._id
      });

      // Emit via Socket.io
      const io = req.app.get('socketio');
      if (io) {
        const populatedMessage = await Message.findById(systemMessage._id).populate('sender', 'name');
        io.to(partner.user.toString()).emit('receiveMessage', populatedMessage);
      }

      res.json(partner);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Reject a partner profile
// @route   PUT /api/admin/partners/:id/reject
// @access  Private/Admin
router.put('/partners/:id/reject', protect, admin, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (partner) {
      partner.status = 'rejected';
      await partner.save();
      res.json(partner);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete a partner profile
// @route   DELETE /api/admin/partners/:id
// @access  Private/Admin
router.delete('/partners/:id', protect, admin, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (partner) {
      res.json({ message: 'Profile permanently removed' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
