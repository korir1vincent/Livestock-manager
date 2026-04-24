// backend/src/models/Consultation.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['farmer', 'vet'],
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet',
    required: true
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  },
  type: {
    type: String,
    enum: ['Video', 'Text', 'Phone'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  diagnosis: String,
  prescription: String,
  recommendations: String,
  duration: Number,
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  notes: String,
  messages: [messageSchema]
}, {
  timestamps: true
});

consultationSchema.index({ userId: 1, status: 1 });
consultationSchema.index({ vetId: 1, status: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);