// Data is sent to "User" schema from this file.

import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js"

export const register = async (req, res) => {
    try { // 'try-catch' block is used so that server don't crash even if some error occur
        if (!req.files || Object.keys(req.files).length === 0) { // if file is not uploaded
            return res.status(400).json({ message: "User photo is required" });
        }
        const { photo } = req.files;
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedFormats.includes(photo.mimetype)) { // checking if uploaded image type matches with 'allowedFormats'
            return res.status(400).json({ message: "Invalid photo format. Only jpeg, png and webp are allowed." });
        }
    
        const { email, name, password, phone, education, role } = req.body;    
        if (!email || !name || !password || !phone || !education || !role || !photo) { // if any field is not given or null
            return res.status(400).json({ message: "Please fill required fields" });
        }
    
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
    
        const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath) // uploading image and getting corresponding string
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error)
        }
    
        const hashedPassword = await bcrypt.hash(password, 10); // to store encrypted password in database
        const newUser = new User({ email, name, password: hashedPassword, phone, education, role, photo: { // 'photo' is an object.
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.url,
        } });
        await newUser.save();
        if (newUser) {
            const token = await createTokenAndSaveCookies(newUser._id, res);
            res.status(201).json({ message: "User registered successfully", newUser, token: token });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errror: "Internal server error" });
    }    
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fields" });
        }

        const user = await User.findOne({ email }).select("+password"); // Due to '+', all other fields along with 'password' is selected ans stored in 'user'.        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);        
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        if (user.role !== role) {
            return res.status(400).json({ message: `Given role ${role} not found` });
        }

        const token = await createTokenAndSaveCookies(user._id, res);
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo,
            },
            token: token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errror: "Internal server error" });
    }
};

export const logout = (req, res) => { // Here we will clear the cookie/jwt.
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errror: "Internal server error" });
    }    
};

export const getMyProfile = async (req, res) => {
    const user = await req.user; // 'req.user' comming from 'isAuthenticated' middleware
    res.status(200).json({ user });
};

export const getAdmins = async (req, res) => {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
};