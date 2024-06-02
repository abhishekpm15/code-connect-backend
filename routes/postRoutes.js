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
  savedPosts,
  unSavePost,
  deletePost,
  likePost,
  showInterest,
  searchPost,
  interestedPosts,
  getSavedBy
} = require("../controllers/postController");

router.get("/allPosts", validateToken, getAllPosts);
router.get("/getPost/:id", validateToken, getPost);
router.get("/myPosts", validateToken, myPosts);
router.get("/savedPosts", validateToken, savedPosts);
router.get("/getSavedBy/:id", validateToken, getSavedBy);
router.get("/interestedPosts", validateToken, interestedPosts);
router.get("/searchPost/:searchValue",validateToken,searchPost);
router.post("/savePost/:id", validateToken, savePost);
router.post("/likePost/:id", validateToken, likePost);
router.post("/unSavePost/:id", validateToken, unSavePost);
router.post("/updatePost/:id", validateToken, updatePost);
router.post("/showInterest/:id", validateToken, showInterest);
router.post("/create", validateToken, createPost);
router.post("/deletePost/:id", validateToken, deletePost);

module.exports = router;
