const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Contacted', 'Converted', 'Lost'],
    default: 'New',
  },
  value: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', LeadSchema);
