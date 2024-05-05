const express = require("express");
const router = express.Router();
const validateToken = require('../middlewares/validateToken')
const {createPost, getAllPosts} = require("../controllers/postController")

router.get('/allPosts',validateToken,getAllPosts)
router.post("/create",validateToken,createPost)

module.exports = router