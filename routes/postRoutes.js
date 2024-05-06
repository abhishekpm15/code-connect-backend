const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const {
  createPost,
  getAllPosts,
  getPost,
  savePost,
} = require("../controllers/postController");

router.get("/allPosts", validateToken, getAllPosts);
router.get("/getPost/:id", validateToken, getPost);
router.post("/savePost/:id", validateToken, savePost);
router.post("/create", validateToken, createPost);

module.exports = router;
