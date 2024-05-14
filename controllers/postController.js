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
  const {
    postName,
    description,
    tags,
    bounty,
    bountyCurrency,
    status,
    uploadedImageURL,
    inputs,
  } = req.body;
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
      uploadedImageURL: uploadedImageURL,
      inputs: inputs,
      bounty: bounty,
      bountyCurrency: bountyCurrency,
    },
    status: status,
  });
  if (newPost) {
    console.log("newPost", newPost);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { posts: newPost.postId } },
      { new: true }
    );

    if (user) {
      res.status(201).json({ message: "Post created Successfully" });
    } else {
      res.status(401);
      throw new Error("Could not update user's posts");
    }
  } else {
    res.status(401);
    throw new Error("Could not create your Post");
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  console.log("post id", postId);
  try {
    const deletedPost = await Post.findOneAndDelete({ postId });
    console.log("deleted post", deletedPost);
    if (!deletedPost) {
      throw new Error("Post not found");
    }
    const user = await User.findByIdAndUpdate(
      deletedPost.postedBy.user_id,
      { $pull: { posts: postId } },
      { new: true }
    );

    console.log(user);

    if (!user) {
      throw new Error("User not found or failed to update user's posts");
    }

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
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
    console.log("id", req.params.id);
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
    if (!post.savedBy.includes(userId)) {
      post.savedBy.push(userId);
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
    res
      .status(200)
      .json({ message: "Post saved successfully", "post details": post });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const unSavePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.savedPosts.includes(req.params.id)) {
      return res.status(400).json({ message: "Post not saved by the user" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { $pull: { savedBy: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: req.params.id } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Post unsaved successfully",
      "post details": updatedPost,
    });
  } catch (error) {
    console.error("Error unsaving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const myPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      const postIds = user.posts;
      return Post.find({ postId: { $in: postIds } });
    })
    .then((posts) => {
      if (posts.length === 0) {
        throw new Error("No posts found");
      }
      console.log("Posts:", posts);
      res.status(200).send(posts);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { postName, description, tags, bounty, bountyCurrency, status } =
    req.body;
  console.log("post id", postId);
  console.log("status", status);
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postId: postId },
      {
        description: {
          name: postName,
          message: description,
          tags: tags,
          bounty: bounty,
          bountyCurrency: bountyCurrency,
        },
        status: status,
      },
      { new: true }
    );
    if (updatedPost) {
      console.log("post updated successfully");
      res.status(200).send("Post updated Successfully");
    } else {
      console.log("post not found");
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Internal Server Error");
  }
});

const savedPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      console.log("user", user);
      const postIds = user.savedPosts;
      return Post.find({ postId: { $in: postIds } });
    })
    .then((posts) => {
      if (posts.length === 0) {
        console.log("postIds", postIds);
        throw new Error("No posts found");
      }
      console.log("Posts:", posts);
      res.status(200).send(posts);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      res.status(500).send({ error: "Internal Server Error" });
    });
});

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  savePost,
  myPosts,
  updatePost,
  savedPosts,
  unSavePost,
  deletePost,
};
