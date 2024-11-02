import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication
// checking if a user is logged in
export const isAuthenticated = async (req, res, next) => { // defining middleware
    try {
        const token = req.cookies.jwt;
        console.log(token);
        if (!token) { // jwt not found
            return res.status(401).json({ error: "User not authenticated" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user; // sending user of req so that we can verify it during creating blog in 'blog.controller.js'
        next(); // control reaches from where this middleware is called
    } catch (error) {
        console.log("Error occuring in Authentication: " + error);
        return res.status(401).json({ error: "User not authenticated" });
    }
};

// Authorization
// checking if user is admin
export const isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `User with given role ${req.user.role} not allowed` });
        }
        next();
    };
};