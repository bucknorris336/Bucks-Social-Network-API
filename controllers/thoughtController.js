const { Thought, User } = require("../models");

module.exports = {
  // Get all courses
  getThoughts(req, res) {
    Thought.find()
      .sort({ createdAt: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a course
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a course
  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body);
      const userData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "No user with that Id!" });
      }
      res.json({ message: "Thought created!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Delete a course
  async deleteThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thoughtData) {
        return res.status(404).json({ message: "No thought with this Id!" });
      }
      const userData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "No User with this Id!" });
      }
      res.json({ message: "Thought Deleted!" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
