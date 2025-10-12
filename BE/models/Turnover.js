const mongoose = require('mongoose');

const TurnoverSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    eventType: {
        type: String,
        enum: ['Join', 'Resign'],
        required: true
    },
    eventDate: {
        type: Date,
        default: Date.now
    },
    reason: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Turnover', TurnoverSchema);