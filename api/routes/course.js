const express = require("express");
const { Course, User } = require("../models");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

//Route that returns a list of all courses and users associated with it
router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});
//Get one course with its details
router.get("/:id", async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
});

// Route that creates a new user.
router.post("/", authenticateUser, async (req, res) => {
  let newCourse;
  try {
    newCourse = await Course.create(req.body);
    res
      .status(201)
      .location("/" + newCourse.id)
      .end();
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

//update a course by ID
router.put("/:id", authenticateUser, async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  try {
    if (req.currentUser.id != req.params.id) {
      res.status(403).json({ message: "Not Authorized" });
    } else {
      await course.update(req.body);
      res.status(204).end();
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((e) => e.message);
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
});

//Delete a course by ID
router.delete("/:id", authenticateUser, async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  try {
    if (req.currentUser.id != course.userId) {
      res.status(403).json({ message: "Not Authorized" });
    } else {
      await course.destroy();
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
