const { default: mongoose } = require("mongoose");

const QuizAnswerSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        selectedOption: {
          type: String,
          enum: ["A", "B", "C", "D"],
        },
        isCorrect: {
          type: Boolean,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuizAnswers = mongoose.model("QuizAnswer", QuizAnswerSchema);

module.exports = QuizAnswers;
