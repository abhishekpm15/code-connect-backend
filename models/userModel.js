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
        ref: "Post",
      },
    ],
    votes: Number,
    savedPosts: [
      {
        type: String,
        ref: "Post",
      },
    ],
    completedPosts: [
      {
        type: String,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
