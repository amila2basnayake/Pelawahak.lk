const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  age: {
    type: Number,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  height: {
    type: String, // e.g., "5'10\""
  },
  education: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  views: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
