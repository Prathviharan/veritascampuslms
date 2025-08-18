const { default: mongoose } = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    completedTutorials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial",
      },
    ],
    attemptedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    completedAssignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
