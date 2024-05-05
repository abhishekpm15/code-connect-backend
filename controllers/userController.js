const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const hashPassword = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const comparePassword = require("../utils/comparePassword");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All field are mandatory");
  }
  const userAvailable = await User.find({ email });
  if (userAvailable.length > 0) {
    res.status(400).json({ message: "User already exists ! Try Sign in" });
    throw new Error("User already Exists");
  }

  const hashedPass = await hashPassword(password);
  const user = await User.create({
    username: name,
    email,
    password: hashedPass,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken({
        username: user.username,
        email: user.email,
        id: user._id,
      }),
    });
  }
  console.log("user created", user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.find({ email });
  if (user.length === 0) {
    res.status(401).json({ message: "User Doesn't exist ! Please Sign up" });
  }
  console.log("user", user);
  console.log("compare", await comparePassword(password, user[0].password));
  if (user && (await comparePassword(password, user[0].password))) {
    console.log('user[0]s',user[0]._id,user[0].username,user[0].email)
    res.status(200).json({
      id: user[0]._id,
      username: user[0].username,
      email: user[0].email,
      token: generateToken({
        username: user[0].username,
        email: user[0].email,
        id: user[0]._id,
      }),
    });
  } else {
    res.status(401).json({ message: "Email or Password is not valid" });
  }

  console.log(user);
});

module.exports = { registerUser, loginUser };
