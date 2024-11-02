// All routes (of user) are mentioned in this file.

import express from "express";
import { getAdmins, getMyProfile, login, logout, register } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout); // ensuring that when logging out, a user is logged in, by 'isAuthenticated' middleware
router.get("/my-profile", isAuthenticated, getMyProfile);
router.get("/admins", getAdmins); // to show all admins

export default router; // will be used in 'index.js' so that we can use the routes