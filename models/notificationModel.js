const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notifications: 
    {
      title: { type: String, required: true },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
