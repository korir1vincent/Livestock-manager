// backend/src/models/Revenue.js
const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Sale', 'Milk', 'Breeding', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  },
  buyer: {
    name: String,
    contact: String
  },
  notes: String
}, {
  timestamps: true
});

// Index for faster queries
revenueSchema.index({ userId: 1, date: -1 });
revenueSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Revenue', revenueSchema);