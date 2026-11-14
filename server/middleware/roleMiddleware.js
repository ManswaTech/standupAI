const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user is populated by your JWT auth middleware
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient privileges.' });
        }
        next();
    };
};

module.exports = verifyRole;