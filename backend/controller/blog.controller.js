import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async (req, res) => {
    try { // 'try-catch' block is used so that server don't crash even if some error occur
        if (!req.files || Object.keys(req.files).length === 0) { // if file is not uploaded
            return res.status(400).json({ message: "Blog Image is required" });
        }
        const { blogImage } = req.files;
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedFormats.includes(blogImage.mimetype)) { // checking if uploaded image type matches with 'allowedFormats'
            return res.status(400).json({ message: "Invalid photo format. Only jpeg, png and webp are allowed." });
        }
    
        const { title, category, about } = req.body;    
        if (!title || !category || !about) { // if any field is not given or null
            return res.status(400).json({ message: "Title, category and about are required fields" });
        }

        const adminName = req?.user?.name; // '?' is used to handle undefined fields.
        const adminPhoto = req?.user?.photo?.url;
        const createdBy = req?.user?._id;
     
        const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath) // uploading image and getting corresponding string
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error)
        }
            
        const blogData = { title, about, category, adminName, adminPhoto, createdBy, blogImage: { // 'blogImage' is an object.
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.url,
        } };
        const blog = await Blog.create(blogData);        
        res.status(201).json({ message: "Blog created successfully", blog });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errror: "Internal server error" });
    }    
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
};

export const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs);
};

export const getSingleBlogs = async (req, res) => { // used when we click on a blog, so that the blog opens
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid blog id" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
};

export const getMyBlogs = async (req, res) => { // used when a used want to see his/her created blogs
    const createdBy = req.user._id;
    const myBlogs = await Blog.find({ createdBy });
    res.status(200).json(myBlogs);
};

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid blog id" });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true }); // the blog with 'id' will be updated with 'req.body'
    if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(updatedBlog);
};