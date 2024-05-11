const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  myProfile,
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myProfile", validateToken, myProfile);

module.exports = router;
