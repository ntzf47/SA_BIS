const mongoose = require('mongoose');

const ManpowerRequestSchema = new mongoose.Schema({
  requestNo: {
    type: String,
    required: true,
    unique: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  requestType: {
    type: String,
    enum: ['New', 'Replacement', 'Project', 'Other'],
    default: 'New'
  },
  requestedHeadcount: {
    type: Number,
    default: 1
  },
  employmentType: {
    type: String,
    enum: ['Permanent', 'Contract', 'Intern', 'Other'],
    default: 'Permanent'
  },
  reason: String,
  status: {
    type: String,
    enum: ['Draft', 'WaitingApproval', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount'
  },
  approvedHeadcount: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('ManpowerRequest', ManpowerRequestSchema);