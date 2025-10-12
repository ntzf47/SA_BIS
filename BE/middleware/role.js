const restrictTo = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.roleName)) {
            return res.status(403).json({ 
                message: `Forbidden. Role (${req.user.roleName}) is not allowed to access this resource.`,
                requiredRoles: allowedRoles
            });
        }
        next();
    };
};

module.exports = { restrictTo };