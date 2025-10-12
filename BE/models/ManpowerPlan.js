const mongoose = require('mongoose');

const ManpowerPlanSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    },
    year: Number,
    plannedHeadcount: Number,
}, {
    timestamps: true
});

module.exports = mongoose.model('ManpowerPlan', ManpowerPlanSchema);