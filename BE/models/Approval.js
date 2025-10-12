const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManpowerRequest',
        required: true
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    approvalDate: Date,
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending'
    },
    comment: String,
    level: Number, 
}, {
    timestamps: true
});

module.exports = mongoose.model('Approval', ApprovalSchema);