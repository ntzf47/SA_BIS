const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, // HR, Employee, Admin
    description: String,
});

module.exports = mongoose.model('Role', RoleSchema);