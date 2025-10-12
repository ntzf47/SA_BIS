const mongoose = require('mongoose');

const UserAccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    lastLogin: Date,
}, {
    timestamps: true
});

module.exports = mongoose.model('UserAccount', UserAccountSchema);