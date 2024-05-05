const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const connectDB = async () => {
  await mongoose
    .connect(`${MONGO_URL}`, {
      dbName: DB_NAME,
    })
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
