const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require('cors')

require('dotenv').config()

const connectDB = require("./config/connection")
connectDB();

app.use(express.json());
app.use(cors())
app.use("/user", userRoutes);
app.use("/post", postRoutes);


app.listen(PORT, (req, res) => {
  console.log("listening on port 5000");
});
