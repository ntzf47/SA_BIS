const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    maxHeadcount: {
        type: Number,
        default: 0
    },
    currentHeadcount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

DepartmentSchema.index({
    organization: 1,
    name: 1
}, {
    unique: true
});

module.exports = mongoose.model('Department', DepartmentSchema);