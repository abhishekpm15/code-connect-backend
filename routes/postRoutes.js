const express = require("express");
const router = express.Router();
const validateToken = require('../middlewares/validateToken')
const {createPost} = require("../controllers/postController")

router.post("/create",validateToken,createPost)

module.exports = router