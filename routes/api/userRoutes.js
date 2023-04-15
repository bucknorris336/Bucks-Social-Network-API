const router = require("express").Router();
const {
  getUser,
  getSingleUser,
  createUser,
  deleteUser,
  createUser,
  deleteUser,
} = require("../../controllers/userController");

// /api/user
router.route("/").get(getUser).post(createUser);

// /api/user/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser);

// /api/user/:userId/thoguhts
router.route("/:userId/thoughts").post(addThought);

// /api/user/:userId/thoguhts/:thoughtId
router.route("/:userId/thoughts/:thoughtId").delete(removeThought);

module.exports = router;
