const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware");
const { protect } = require("../middleware/auth.middleware");

// GET all users (admin)
router.get("/", protect, controller.getUsers);

// Register
router.post("/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  validate,
  controller.registerUser
);

// Login
router.post("/login",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  validate,
  controller.loginUser
);

module.exports = router;
