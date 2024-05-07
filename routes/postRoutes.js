const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const {
  createPost,
  getAllPosts,
  getPost,
  savePost,
  myPosts,
  updatePost,
} = require("../controllers/postController");

router.get("/allPosts", validateToken, getAllPosts);
router.get("/getPost/:id", validateToken, getPost);
router.get("/myPosts", validateToken, myPosts);
router.post("/savePost/:id", validateToken, savePost);
router.post("/updatePost/:id", validateToken, updatePost);
router.post("/create", validateToken, createPost);

module.exports = router;
