const Course = require("../../models/courses.model");
const Enrollment = require("../../models/enrollment.model");
const Module = require("../../models/moduleModel");

exports.getCourseModules = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId).select("modules");

    if (!course) {
      return res.status(400).json({ message: "Course not found!" });
    }

    res.status(200).json(course.modules);
  } catch (error) {
    console.error("Error fetching course modules:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCourseDetails = async (req, res) => {
  const { title } = req.body;

  try {
    const course = await Course.findById(title);

    if (!course) {
      return res.status(400).json({ message: "Course not found!" });
    }

    res.status(200).json(course);
  } catch (error) {}
};

exports.moduleEnrollment = async (req, res) => {
  const { moduleId } = req.params;
  const { studentId, code } = req.body;

  if (!studentId || !moduleId) {
    return res
      .status(400)
      .json({ error: "studentId and moduleId are required." });
  }

  try {
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (module.code !== code) {
      return res.status(401).json({ error: "Incorrect code" });
    }

    const newEnrollment = new Enrollment({
      studentId,
      moduleId,
    });

    await newEnrollment.save();

    res.json({
      message: "Enrollment successful!",
      enrollment: newEnrollment,
    });
  } catch (err) {
    console.error("Enrollment Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.GetEnrolledmodules = async (req, res) => {
  const { studentId } = req.params;

  try {
    const enrollments = await Enrollment.find({ studentId }).populate(
      "moduleId"
    );
    const modules = enrollments.map((enroll) => enroll.moduleId);
    res.json(modules);
  } catch (err) {
    res.json({ message: "failed to fetch the enrollment list" });
  }
};
