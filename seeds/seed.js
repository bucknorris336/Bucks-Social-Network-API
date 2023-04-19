const { User, Thought } = require("../models");
const users = require("./user.json");
const db = require("../config/connection");

db.once("open", async () => {
  try {
    const newUsers = await User.insertMany(users);
  } catch (error) {
    console.log(error);
  }
});
