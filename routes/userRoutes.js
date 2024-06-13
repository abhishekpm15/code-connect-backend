const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  myProfile,
  editProfile,
  getProfile
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myProfile", validateToken, myProfile);
router.get("/getProfile/:id", validateToken, getProfile);
router.post("/edit/:id", validateToken, editProfile);


module.exports = router;
