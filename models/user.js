const { Schema, model } = require("mongoose");
const thoughtSchema = require("./Assignment");

// Schema to create Student model
const userSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      max_length: 50,
    },
    last: {
      type: String,
      required: true,
      max_length: 50,
    },
    github: {
      type: String,
      required: true,
      max_length: 50,
    },
    thoughts: [thoughtSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model("user", userSchema);

module.exports = User;
