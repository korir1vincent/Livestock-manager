const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  category: { 
    type: String, 
    enum: ['Feed', 'Veterinary', 'Medicine', 'Equipment', 'Labor', 'Other'], 
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
  receipt: String,
  notes: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
