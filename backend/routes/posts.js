const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware"); // JWT check
const upload = require("../middleware/uploadMiddleware"); // Cloudinary upload

// Create post (only logged in users)
router.post("/posts", authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  
  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ 
      error: 'Title and content are required',
      received: { title, content }
    });
  }

  try {
    const postData = {
      title,
      content,
      userId: req.user.id, // comes from JWT
      comments: [],
      likes: []
    };

    // If an image was uploaded, add the Cloudinary URL
    if (req.file) {
      postData.imageUrl = req.file.path; // Cloudinary URL
    }

    const post = await Post.create(postData);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts (public) with author information
router.get("/posts", async (req, res) => {
  const db = require("../db");
  
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Get posts sorted by newest first
    
    // Get author information for each post
    const postsWithAuthors = await Promise.all(posts.map(async (post) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT name FROM users WHERE id = ?", 
          [post.userId],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              const authorName = results.length > 0 ? results[0].name : "Unknown User";
              resolve({
                ...post.toObject(),
                authorName
              });
            }
          }
        );
      });
    }));
    
    res.json(postsWithAuthors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload image endpoint (for testing or standalone image uploads)
router.post("/upload-image", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    
    res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
