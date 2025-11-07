const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, name);
  },
});
const upload = multer({ storage });


router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const text = req.body.text || "";
    const image = req.file ? "/uploads/" + req.file.filename : null;
    const post = new Post({ user: req.user.id, text, image });
    await post.save();
    await post.populate("user", "name");
    res.status(201).json(post);
  } catch (err) {
    console.error("POST CREATE ERROR:", err);
    res.status(500).json({ message: "Server error while creating post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    post.text = req.body.text || post.text;
    if (req.file) post.image = "/uploads/" + req.file.filename;

    await post.save();
    await post.populate("user", "name");
    res.json(post);
  } catch (err) {
    console.error("POST UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error while updating post" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    console.log(" DELETE request received");
    console.log(" URL:", req.originalUrl);
    console.log(" Params:", req.params);

    const { id } = req.params;
    if (!id || id === "undefined") {
      console.log(" Invalid post ID received");
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });


    if (post.image) {
      const oldPath = path.join(__dirname, "..", post.image);
      const deletedDir = path.join(__dirname, "..", "deleted_uploads");
      const fileName = path.basename(post.image);
      const newPath = path.join(deletedDir, fileName);

      if (!fs.existsSync(deletedDir)) fs.mkdirSync(deletedDir);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved image to deleted_uploads: ${fileName}`);
      }
    }

    await Post.findByIdAndDelete(id);
    console.log(` Post deleted successfully (ID: ${id})`);
    res.json({ message: "Post deleted successfully and image moved" });
  } catch (err) {
    console.error("POST DELETE ERROR:", err);
    res.status(500).json({ message: "Server error while deleting post" });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const idx = post.likes.findIndex((l) => l.toString() === req.user.id);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: idx < 0 });
  } catch (err) {
    console.error("POST LIKE ERROR:", err);
    res.status(500).json({ message: "Server error while liking post" });
  }
});


router.post("/:id/comment", auth, async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const text = req.body.text || "";
    if (!text.trim())
      return res.status(400).json({ message: "Empty comment" });

    post.comments.unshift({ user: req.user.id, text });
    await post.save();
    await post.populate("comments.user", "name");
    res.json(post.comments);
  } catch (err) {
    console.error("POST COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error while commenting" });
  }
});

module.exports = router;
