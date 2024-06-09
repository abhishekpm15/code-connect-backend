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
      res.status(401).json({ message: "Failed to fetch notifications", error: error.message });
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


const removeNotification =asyncHandler(async(req,res)=>{
  console.log('user id', req.user.id);
  const userId = req.user.id;
  console.log('notitication id', req.params.id)
  const notificationId = req.params.id;
  const notifictations = await Notification.find({userId : userId})
  console.log('notification found',notifictations)
  if(notifictations && notifictations.length > 0){
    const notificationToDelete = notifictations.find(notification => notification._id.toString() === notificationId);
    if (notificationToDelete) {
      await Notification.findByIdAndDelete(notificationId);
      const updatedNotifications = await Notification.find({ userId: userId });
      res.status(200).send(updatedNotifications)
      console.log('Notification deleted:', notificationToDelete);
    } else {
      console.log('Notification not found');
      res.status(400).json({message: "Could not delete notification"})
    }
  }
})

module.exports = { fetchAllNotifications, sendNotification, removeNotification };
