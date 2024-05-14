const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
  let i = 5;
  await mongoose
    .connect(`${MONGO_URL}`, {
      dbName: DB_NAME,
    })
    .then(() => {
      console.log("connected to db");
      return
    })
    .catch((err) => {
      setTimeout(() => {
        setInterval(() => {
          if(i == 0){
            return
          }
          console.log(`trying to connect in ${i}s`);
          i--;
        }, 1000);
        return connectDB();
      }, 5000);
      console.log(err);
    });
};

module.exports = connectDB;


// return new Promise((resolve)=>{
//   console.log('promise resolved');
//   return resolve
// })