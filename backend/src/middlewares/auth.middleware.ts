import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";
dotenv.config();
const secret = process.env.JWT_SECRET;


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const decoded = jwt.verify(token, secret); //it contains the userId, iat and exp 
        req.user = decoded; // attach user info 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};