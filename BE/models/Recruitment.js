const mongoose = require('mongoose');

const RecruitmentSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManpowerRequest'
    },
    candidateName: String,
    status: {
        type: String,
        enum: ['Interview', 'Hired', 'Rejected', 'OfferPending'],
        default: 'Interview'
    },
    hireDate: Date,
}, {
    timestamps: true
});

module.exports = mongoose.model('Recruitment', RecruitmentSchema);