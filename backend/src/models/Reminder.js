const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['Vaccination', 'Checkup', 'Medication', 'Breeding', 'Deworming', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  date: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  notes: String,
  recurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
  }
}, {
  timestamps: true
});

// Index for faster queries
reminderSchema.index({ userId: 1, date: 1 });
reminderSchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);