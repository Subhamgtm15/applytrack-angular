import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";

dotenv.config();

const app = express();

// Render terminates TLS at its proxy; trust it so secure cookies are honored in production.
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// The frontend origin is configurable so the same code works locally and in production (e.g. the Vercel URL).
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(cors({
    origin: clientUrl,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Public health check endpoint (used by Render's healthCheckPath). Must return 200
// and must be declared before the auth-protected application routes mounted at "/".
app.get("/", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

// Use the auth routes for any requests to /auth
app.use("/auth", authRoutes);

// Use the application routes for any requests to /api
app.use("/", applicationRoutes);


const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});