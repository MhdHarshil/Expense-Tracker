// const express = require('express');
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
// const {
//     registerUser,
//     loginUser,
//     getUserProfile,
// } = require('../controllers/authController');
import { registerUser, loginUser, getUserInfo } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
// import {  }

// app.use(express.json());
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

// module.exports = router;
export default router;