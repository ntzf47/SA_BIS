const jwt = require('jsonwebtoken');
const UserAccount = require('../models/UserAccount');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserAccount.findById(decoded.id).populate('role', 'name');
        req.user.roleName = req.user.role.name;
        if (!req.user.id) throw new Error('Not authorized, token failed');
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
};
module.exports = {
    protect
};