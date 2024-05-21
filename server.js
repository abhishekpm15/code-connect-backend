const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const http = require("http");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connection");
const { Server } = require("socket.io");
const server = http.createServer(app);

let onlineUsers = [];

const addUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
  console.log("online users", onlineUsers);
};

const removeUser = (sockerId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== sockerId);
  console.log(onlineUsers);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newUser", (userid) => {
    console.log("add user", userid);
    addUser(userid, socket.id);
  });
  socket.on("sendNotification", ({ viewerName, postedBy }) => {
    console.log("viewer name, postedBy", viewerName, postedBy);
    const receiver = getUser(postedBy.user_id);
    console.log("receiver", receiver);
    io.to(receiver?.socketId).emit("getNotification", {
      senderName: viewerName,
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("a user left");
  });
});

connectDB();
app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/post", postRoutes);

server.listen(PORT, '0.0.0.0',() => {
  console.log(`Listening on port ${PORT}`);
});
