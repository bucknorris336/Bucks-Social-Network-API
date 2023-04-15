// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;
const { User, Course } = require("../models");

// TODO: Create an aggregate function to get the number of students overall
const headCount = async () =>
  // Your code here
  User.aggregate()
    .count("userCount")
    .then((numberOfUsers) => numberOfUsers);

// Execute the aggregate method on the Student model and calculate the overall grade by using the $avg operator
const grade = async (userId) =>
  User.aggregate([
    // TODO: Ensure we include only the student who can match the given ObjectId using the $match operator
    {
      // Your code here
      $match: {
        _id: ObjectId(userId),
      },
    },
    {
      $unwind: "$application",
    },
    // TODO: Group information for the student with the given ObjectId alongside an overall grade calculated using the $avg operator
    {
      // Your code here
      $group: {
        _id: ObjectId(studentId),
        overallGrade: {
          $avg: "$application.score",
        },
      },
    },
  ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
              grade: await grade(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new student
  createStudent(req, res) {
    Student.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteUser(req, res) {
    Student.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !student
          ? res.status(404).json({ message: "No such user exists" })
          : Course.findOneAndUpdate(
              { students: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((course) =>
        !course
          ? res.status(404).json({
              message: "User deleted, but no courses found",
            })
          : res.json({ message: "User successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a student
  addAssignment(req, res) {
    console.log("You are adding an application");
    console.log(req.body);
    Student.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { application: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(User)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove application from a student
  removeApplication(req, res) {
    Student.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { assignment: { applicationId: req.params.applicationId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
