const router = require("express").Router();
const {
  getThoughts,
  getsingleThought,
  createThought,
  updateThought,
  deleteThought,
} = require("../../controllers/thoughtController.js");

// /api/courses
router.route("/").get(getThoughts).post(createThought);

// /api/courses/:courseId
router
  .route("/:thoughtId")
  .get(getsingleThought)
  .put(updateThought)
  .delete(deleteThought);

module.exports = router;
