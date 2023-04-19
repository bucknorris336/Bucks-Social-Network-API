const { Thought, User } = require("../models");

module.exports = {
  // Get all courses
  getUser(req, res) {
    User.find()
      .sort({ createdAt: -1 })
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a user
  getSingleUser(req, res) {
    Thought.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      {
        req.body.userId;
      }
      if (!userData) {
        return res.status(404).json({ message: "No user with that Id!" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({
        _id: req.params.userId,
      });
      if (!userData) {
        return res.status(404).json({ message: "No User with this Id!" });
      }
      res.json({ message: "User Deleted!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // add friend to friend list
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Update a User
  updateThought(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
