const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  myProfile,
  editProfile
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myProfile", validateToken, myProfile);
router.post("/edit/:id", validateToken, editProfile);


module.exports = router;
