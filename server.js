const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const http = require("http");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes")
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connection");
const { Server } = require("socket.io");
const server = http.createServer(app);

let onlineUsers = [];

const addUser = (userID, socketId) => {
  const userExists = onlineUsers.some((user) => user.userID === userID);
  if (userExists) {
    onlineUsers = onlineUsers.map((user) =>
      user.userID === userID ? { ...user, socketId } : user
    );
  } else {
    onlineUsers.push({ userID, socketId });
  }
  console.log("online users", onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  console.log("online users after removal", onlineUsers);
};

const getUser = (userID) => {
  return onlineUsers.find((user) => user.userID === userID);
};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("newUser", (userID) => {
    addUser(userID, socket.id);
  });

  socket.on("sendNotification", ({ viewerName, viewerID, postedBy }) => {
    const receiver = getUser(postedBy.user_id);
    if (receiver) {
      io.to(receiver.socketId).emit("getNotification", {
        senderName: viewerName,
        receiverId: postedBy.user_id,
      });
    }
  });

  socket.on("sendLike", (id) => {
    socket.broadcast.emit("getLike", id);
  });

  socket.on("unsendLike", (id) => {
    socket.broadcast.emit("removeLike", id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("a user disconnected");
  });
});

connectDB();
app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/notification", notificationRoutes);


server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
