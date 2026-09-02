import rateLimit from "express-rate-limit";

// Limits repeated login attempts to slow down brute-force/credential-stuffing attacks.
// 5 requests per 15 minutes per IP.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true, // send rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disable the deprecated `X-RateLimit-*` headers
    handler: (_req, res) => {
        res.status(429).json({
            message: "Too many login attempts. Please try again after 15 minutes.",
        });
    },
});

// Limits how often new accounts can be created from the same IP.
// 3 requests per hour per IP.
export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            message: "Too many accounts created. Please try again after an hour.",
        });
    },
});
