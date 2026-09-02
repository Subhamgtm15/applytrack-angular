import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
//passport builds the url from the client id and secret and redirects the user to google login page
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            callbackURL: process.env.CALLBACK_URL!,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0].value;
                const fullName = profile.displayName;

                //check if user already exists by google_id
                const byGoogleId = await pool.query(
                    "SELECT * FROM users WHERE google_id = $1",[googleId]);

                if (byGoogleId.rows.length > 0) {
                    return done(null, byGoogleId.rows[0]);
                } 

                // Check if a user with this email already exists (signed up with email/password)
                const byEmail = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email]);

                if (byEmail.rows.length > 0) {
                    // link the google_id to the existing account
                    const linked = await pool.query(
                        `UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *`,
                        [googleId, email]
                    );
                    return done(null, linked.rows[0]);
                }

                // If the user doesn't exist, create a new user
                const newUserResult = await pool.query(
                    `INSERT INTO users ("fullName", email, google_id) VALUES ($1, $2, $3) RETURNING *`,
                    [fullName, email, profile.id]
                );

                return done(null, newUserResult.rows[0]);
            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )

);
export default passport;