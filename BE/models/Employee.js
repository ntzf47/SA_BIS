const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    employmentType: {
        type: String,
        enum: ['Permanent', 'Contract', 'Intern', 'Other'],
        default: 'Permanent'
    },
    hireDate: Date,
    resignDate: Date,
}, {
    timestamps: true
});

EmployeeSchema.pre('save', function (next) {
    this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);