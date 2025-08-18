const express = require("express");
const {
  signUp,
  signIn,
} = require("../../controllers/student/authController");

const router = express.Router();

// Routes
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
