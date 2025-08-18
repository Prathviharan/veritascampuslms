const express = require("express");
const {
  submitQuizAnswer,
} = require("../../controllers/student/quizAnswers.controller");

const router = express.Router();

router.post("/:quizId", submitQuizAnswer);

module.exports = router;
