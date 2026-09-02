import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { pool } from "../db";
import { authMiddleware } from "../middlewares/auth.middleware";
import { loginLimiter, signupLimiter } from "../middlewares/rateLimit.middleware";
import { AuthRequest } from "../types/authRequest";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// In production the frontend (Vercel) and backend (Render) live on different domains, so the
// auth cookie must be cross-site: sameSite "none" + secure. Locally we use lax + insecure.
const isProduction = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
const cookieOptions = {
    httpOnly: true, // prevents client-side JavaScript from accessing the cookie
    secure: isProduction, // requires HTTPS in production
    sameSite: isProduction ? "none" as const : "lax" as const,
    // Frontend (Vercel) and backend (Render) are on different sites, so the auth cookie is
    // "third-party". Chrome now blocks such cookies unless they are partitioned (CHIPS).
    partitioned: isProduction,
    maxAge: 60 * 60 * 1000, // browser delete cookie time
};

// POST /signup endpoint for user registration
router.post("/signup", signupLimiter, async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO users ("fullName", email, password) VALUES ($1, $2, $3) RETURNING *`;
    const values = [fullName, email, hashedPassword];
    try {
        const result = await pool.query(insertQuery, values);
        const { password: _, ...safeUser } = result.rows[0];  // Exclude the password from the response

        res.status(201).json({ message: 'User registered successfully', user: safeUser });
    }
    catch (error: any) {
        if (error.code === '23505') {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: "An error occurred while registering the user" });
    }
});


// POST /login endpoint for user authentication
router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const queryText = 'SELECT user_id, password FROM users WHERE email = $1';

    try {
        const result = await pool.query(queryText, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password); // this give the result in boolean
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate JWT token
        const jwtToken = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
        // Set the token in an HTTP-only cookie
        res.cookie("token", jwtToken, cookieOptions);
        return res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "An error occurred while logging in" });
    }
})


// POST /logout endpoint for user logout

router.post("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout successful" });
});


// POST /session - exchange a token issued by the OAuth callback for the auth cookie.
// The Google callback runs while the browser is on the backend domain, so a partitioned (CHIPS)
// cookie set there is keyed to the backend's partition and is invisible to the frontend. Instead
// the callback hands the token to the frontend, which posts it here so the cookie is set from the
// frontend's own top-level context (correct partition) and is then sent on subsequent requests.
router.post("/session", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({ message: "Session established" });
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
});


// GET /me - fetch the currently logged-in user
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user.userId;
    const selectQuery = `SELECT "fullName", email, current_position, target_position, linkedin FROM users WHERE user_id = $1`;
    try {
        const result = await pool.query(selectQuery, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "user found", user:result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the user" });
    }
});

// PUT /me - update the currently logged-in user's profile
router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.user.userId;
    const { fullName, currentPosition, targetPosition, linkedin } = req.body;

    if (!fullName || !fullName.trim()) {
        return res.status(400).json({ message: "Full name is required" });
    }

    const updateQuery = `
        UPDATE users
        SET "fullName" = $1, current_position = $2, target_position = $3, linkedin = $4
        WHERE user_id = $5
        RETURNING "fullName", email, current_position, target_position, linkedin`;
    const values = [
        fullName.trim(),
        currentPosition ?? null,
        targetPosition ?? null,
        linkedin ?? null,
        userId,
    ];

    try {
        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the profile" });
    }
});

//start the Google OAuth flow
// this is the middelware that will redirect the user to google login page
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));

//handle the callback from Google after authentication
router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${clientUrl}/login`,
    }),
    (req, res) => {
        const user = req.user as any;

        const jwtToken = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // Hand the token to the frontend via the URL fragment (never sent to servers/logs). The
        // frontend exchanges it at POST /session so the auth cookie is set in the frontend's
        // partition. Setting the cookie here would store it under the backend's partition (CHIPS)
        // and it would never be sent from the Vercel origin.
        res.redirect(`${clientUrl}/auth/callback#token=${jwtToken}`);
    }
);

export default router;