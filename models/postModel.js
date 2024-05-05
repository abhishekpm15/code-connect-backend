const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    postedBy: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      user:{
        username: String,
        email: String,
      }
    },
    description: {
      name: String,
      message: String,
      tags: Array,
      bounty: {
        min: Number,
        max: Number,
      },
      bountyCurrency: String
    },
    completed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
