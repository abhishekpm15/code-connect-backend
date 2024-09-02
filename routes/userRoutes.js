const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  myProfile,
  editProfile,
  getProfile,
  getTotalBounty
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myProfile", validateToken, myProfile);
router.get("/getProfile/:id", validateToken, getProfile);
router.post("/edit/:id", validateToken, editProfile);
router.get("/getTotalBounty/:id",validateToken, getTotalBounty);


module.exports = router;
