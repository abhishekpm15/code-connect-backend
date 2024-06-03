const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

const fetchAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("user if",userId)
    try {
      const notifications = await Notification.find({ userId });
      console.log(notifications)
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
});

const sendNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { viewerID, postID, viewerName,postedBy } = req.body;
  console.log("userID, viewerID, postID viewerName postedBy", userId, viewerID, postID,viewerName, postedBy);
  const post = await Post.findOne({ postId: postID });
  const postName = post.description.name;
  console.log(post.description.name);
  const newNotification = new Notification({
    userId: postedBy.user_id,
    notifications: {
      title: "New Notification",
      message: `Received interest from ${viewerName} on Post ${postName}`,
    },
  });
  try {
    const savedNotification = await newNotification.save();
    res.status(201).json({
      message: "Notification sent successfully",
      notification: savedNotification,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Failed to send notification", error: error.message });
  }
});

module.exports = { fetchAllNotifications, sendNotification };
