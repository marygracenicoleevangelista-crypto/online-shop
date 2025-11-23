const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers
} = require("../controllers/user.controller");

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

