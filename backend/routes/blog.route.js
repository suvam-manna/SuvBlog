// All routes (of blog) are mentioned in this file.

import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getMyBlogs, getSingleBlogs, updateBlog } from "../controller/blog.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"), createBlog); // ensuring that when creating a blog, a user is logged in, by 'isAuthenticated' middleware // ensuring that only an admin user can create blog, by 'isAdmin' middleware
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog); // ':id' -> id of blog is passed which is to be deleted // ensuring that when deleting a blog, a user is logged in, by 'isAuthenticated' middleware // ensuring that only an admin user can delete blog, by 'isAdmin' middleware
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlogs);
router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);

export default router; // will be used in 'index.js' so that we can use the routes