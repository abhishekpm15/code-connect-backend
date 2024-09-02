const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: String,
        ref: "Posts",
      },
    ],
    votes: Number,
    savedPosts: [
      {
        type: String,
        ref: "Posts",
      },
    ],
    interestedPosts: [
      {
        type: String,
        ref: "Posts",
      },
    ],
    completedPosts: [
      {
        type: String,
        ref: "Posts",
      },
    ],
    displayPic: {
      type: String,
    },
    bio: {
      type: String,
    },
    websiteLinks: [{}],
    socialLinks: {
      github: String,
      twitter: String,
    },
    techStack: [],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
