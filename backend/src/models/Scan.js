// backend/src/models/Scan.js
const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  },
  imageUrl: {
    type: String,
    required: true
  },
  analysis: {
    livestock: String,
    confidence: Number,
    healthStatus: String,
    condition: String,
    symptoms: [String],
    recommendations: [{
      type: String,
      items: [String]
    }],
    vetConsultRequired: Boolean,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    }
  },
  userNotes: String,
  actionTaken: String,
  followUpRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);