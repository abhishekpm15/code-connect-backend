const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const postSchema = mongoose.Schema(
  {
    postId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    postedBy: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      user: {
        username: String,
        email: String,
      },
    },
    description: {
      name: String,
      message: String,
      tags: Array,
      uploadedImageURL: Array,
      inputs: Array,
      bounty: {
        min: Number,
        max: Number,
      },
      bountyCurrency: String,
    },
    status: {
      type: String,
    },
    savedBy: {
      type: Array,
      ref: "User",
    },
    likes: {
      type: Array,
      ref: "User",
    },
    interestShown: {
      type: Array,
      ref: "User",
    },
    acceptedBy: {
      isAccepted: {
        type: Boolean,
        default: false,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, 
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
