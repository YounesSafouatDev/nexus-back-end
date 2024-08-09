const rateLimit = require('express-rate-limit');

// Rate limiter to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: 'Too many login attempts from this IP, please try again later.',
    handler: (req, res) => {
        const now = Date.now();
        const resetTime = req.rateLimit.resetTime;
        const retryAfterMs = Math.ceil(resetTime - now);

        res.status(429).json({
            error: 'Too many requests',
            message: 'Too many login attempts from this IP, please try again later.',
            retryAfter: retryAfterMs,
        });
    }
});

module.exports = {
    loginLimiter,
};
