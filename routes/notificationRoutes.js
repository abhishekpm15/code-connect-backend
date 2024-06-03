const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");

const {
  fetchAllNotifications,
  sendNotification
} = require("../controllers/notificationController");

router.get("/fetchAllNotifications", validateToken, fetchAllNotifications);
router.post("/sendNotification", validateToken, sendNotification);


module.exports = router;
