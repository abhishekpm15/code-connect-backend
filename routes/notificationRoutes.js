const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");

const {
  fetchAllNotifications,
  sendNotification,
  removeNotification
} = require("../controllers/notificationController");

router.get("/fetchAllNotifications", validateToken, fetchAllNotifications);
router.post("/sendNotification", validateToken, sendNotification);
router.delete("/removeNotification/:id", validateToken, removeNotification);



module.exports = router;
