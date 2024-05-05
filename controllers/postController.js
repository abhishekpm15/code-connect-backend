const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

const getAllPosts = asyncHandler(async (req, res) => {
  await Post.find({})
    .then((response) => {
      console.log("all posts", response);
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log("posts err", err);
      throw new Error("Cannot fetch");
    });
});

const createPost = asyncHandler(async (req, res) => {
  const { postName, description, tags, bounty, bountyCurrency } = req.body;
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
  });
  if (newPost) {
    res.status(201).json({ message: "Post created Successfully" });
  } else {
    res.status(401);
    throw new Error("Could not create you Post");
  }

  console.log(postName, description, tags, bounty, bountyCurrency);
  res.status(201).json({ message: "got it" });
});

module.exports = { createPost, getAllPosts };
