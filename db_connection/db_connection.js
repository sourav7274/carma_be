require("dotenv").config();
const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB;

const initialDatabase = async () => {
  await mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};
module.exports = { initialDatabase };
