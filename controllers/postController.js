const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const getAllPosts = asyncHandler(async (req, res) => {
  console.log("page", req.query.page);
  console.log("number", req.query.limit);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [posts, totalCount] = await Promise.all([
      Post.find().skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.status(200).json({
      posts,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedPosts.includes(req.params.id)) {
      return res
        .status(400)
        .json({ message: "Post already saved by the user" });
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
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Post saved successfully", postDetails: post });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getSavedBy = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  console.log("userId postId", userId, postId);
  try {
    const post = await Post.findOne({ postId: req.params.id }).select(
      "savedBy"
    );
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    const isSavedByUser = post.savedBy.includes(userId);
    console.log("isSavedBY", isSavedByUser);
    res.status(200).json({ savedByUser: isSavedByUser });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error");
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

const interestedPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      console.log("user", user);
      const postIds = user.interestedPosts;
      console.log('post ids',postIds)
      return Post.find({ postId: { $in: postIds } });
    })
    .then((posts) => {
      if (posts.length === 0) {
        console.log("postIds", posts);
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

const likePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  console.log("user id", userId);
  console.log("post id", postId);
  const post = await Post.findOne({ postId: postId });
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const userLikedIndex = post.likes.indexOf(userId);
  if (userLikedIndex === -1) {
    post.likes.push(userId);
    res.status(200).send("Liked");
    await post.save();
  } else {
    post.likes.splice(userLikedIndex, 1);
    res.status(200).send("Unliked");
    await post.save();
  }
});

const showInterest = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.id;
    const viewerID = req.body.viewerID;
    const viewerEmail = req.body.viewerEmail;
    const viewerName = req.body.viewerName;
    console.log(postId, viewerID, viewerEmail, viewerName);
    const post = await Post.findOne({ postId: postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const user = await User.findById(viewerID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userInterestIndex = post.interestShown.indexOf(viewerID);
    if (userInterestIndex === -1) {
      post.interestShown.push(viewerID);
      console.log("interest", post);
      user.interestedPosts.push(postId);
      await post.save();
      await user.save();
      console.log("interest added", post);
      console.log("interest usre", user);
      res
        .status(200)
        .send(
          "Thank you for showing interest! You will be soon contacted by the owner of this post"
        );
    } else {
      post.interestShown.splice(userInterestIndex, 1);
      console.log("interest", post);
      user.interestedPosts.pull(postId);
      await post.save();
      await user.save();
      console.log("interest removed", post);
      console.log("interest usre", user);
      res.status(200).send("Removed from Interest");
    }
  } catch (error) {
    console.error("Error showing interest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const searchPost = asyncHandler(async (req, res) => {
  try {
    console.log("search value", req.params.searchValue);
    const searchValue = req.params.searchValue;
    const posts = await Post.find({
      $or: [
        { "description.name": { $regex: searchValue, $options: "i" } },
        { "description.tags": { $regex: searchValue, $options: "i" } },
      ],
    });

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const stashPost = asyncHandler(async (req, res) => {
  const { postID } = req.params;
  const {receiverId} = req.body;
  const userId = req.user.id;
  console.log("my user id", userId);
  try {
    const post = await Post.findOneAndUpdate(
      { postId: postID },
      {
        $set: {
          status: "stashed", 
          acceptedBy: {
            isAccepted: true,
            user_id: receiverId,
          },
        },
      },
      { new: true }
    );
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    console.log("AFter post stashed" , post);
    return res.status(200).send({ message: "Post accepted", post });
  } catch (err) {
    console.error("Error accepting post", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
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
  likePost,
  showInterest,
  searchPost,
  interestedPosts,
  getSavedBy,
  stashPost
};
