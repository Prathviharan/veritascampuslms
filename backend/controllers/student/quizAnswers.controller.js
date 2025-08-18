const Quiz = require("../../models/Quiz");
const QuizAnswers = require("../../models/Student/QuizAnswer.model");

const submitQuizAnswer = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const answers = req.body.answers; // array of { questionId, selectedOption }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: "Quiz does not exist" });
    }

    const formattedAnswers = answers.map(({ questionId, selectedOption }) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === questionId
      );

      if (!question) {
        throw new Error(`Question with ID ${questionId} not found`);
      }

      const isCorrect = selectedOption === question.correctAnswer;

      return {
        questionId,
        selectedOption,
        isCorrect,
      };
    });

    const quizAnswers = new QuizAnswers({
      quizId,
      answers: formattedAnswers,
      submittedAt: new Date(),
    });

    await quizAnswers.save();

    return res
      .status(200)
      .json({ message: "All answers submitted successfully" });
  } catch (err) {
    console.error("Error during submission:", err.message);
    return res.status(500).json({ message: "Submission failed" });
  }
};

module.exports = {
  submitQuizAnswer,
};
