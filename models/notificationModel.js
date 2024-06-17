const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: {
      title: { type: String, required: true },
      message: { type: String, required: true },
      sentBy:{type: String},
      postInfo:{
        postID: {type: String},
        postName: {type: String}
      },
      read: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
