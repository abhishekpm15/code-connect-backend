const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const getAllPosts = asyncHandler(async (req, res) => {
  await Post.find({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log("posts err", err);
      throw new Error("Cannot fetch");
    });
});

const createPost = asyncHandler(async (req, res) => {
  const { postName, description, tags, bounty, bountyCurrency, status } = req.body;
  console.log("request user", req.user);
  const newPost = await Post.create({
    postedBy: {
      user_id: req.user.id,
      user: {
        username: req.user.username,
        email: req.user.email,
      },
    },
    description: {
      name: postName,
      message: description,
      tags: tags,
      bounty: bounty,
      bountyCurrency: bountyCurrency,
    },
    status: status
  });
  if (newPost) {
    console.log("newPost", newPost);
    res.status(201).json({ message: "Post created Successfully" });
  } else {
    res.status(401);
    throw new Error("Could not create you Post");
  }

  console.log(postName, description, tags, bounty, bountyCurrency);
  res.status(201).json({ message: "got it" });
});

const getPost = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  try {
    const post = await Post.findOne({ postId: req.params.id });
    if (!post) {
      res.status(401);
      throw new Error("Could not find the post");
    }
    res.status(200).send(post);
  } catch (error) {
    console.error("Error finding post by ID:", error);
    throw error;
  }
});

const savePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.id });
    console.log('id',req.params.id)
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    console.log("saved posts", user.savedPosts);
    if (user.savedPosts.includes(req.params.id)) {
      res.status(400).json({ message: "Post already saved by the user" });
    }
    if(!post.savedBy.includes(userId)){
      post.savedBy.push(userId)
      await post.save();
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPosts: req.params.id } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Post saved successfully", "post details": post });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { createPost, getAllPosts, getPost, savePost };
