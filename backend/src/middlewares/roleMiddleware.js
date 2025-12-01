// backend/src/middlewares/roleMiddleware.js

// এই ফাংশনটি চেক করবে ইউজারের রোল সঠিক কিনা
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { authorize };