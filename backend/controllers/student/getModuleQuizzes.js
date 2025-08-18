const Module = require("../../models/moduleModel");

exports.getModuleQuizzes = async (req, res) => {
  const moduleId = req.params.id;

  try {
    const module = await Module.findById(moduleId);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(module.quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};
