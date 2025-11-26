const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/user.controller");

router.get("/", getUsers);           // GET /users
router.post("/register", registerUser); // POST /users/register
router.post("/login", loginUser);       // POST /users/login

module.exports = router;
