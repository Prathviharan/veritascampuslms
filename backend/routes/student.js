const express = require("express");
const router = express.Router();

const {
  getProgress,
  markLectureComplete,
  markTutorialComplete,
  markQuizAttempt,
  markAssignmentComplete,
} = require("../controllers/student/progress.controller");

const {
  getModuleContent,
} = require("../controllers/student/module.controller");
const {
  editStudent,
  changepassowrd,
  getStudent,
  addStudent,
  changepassword,
} = require("../controllers/student/student.controller");
// const {
//   addCourse,
//   Courses,
//   CourseEnrollment,
//   GetEnrolledCourses,
// } = require("../controllers/student/module.controller");
const upload = require("../middleware/upload.middleware");
const User = require("../models/Student/User");
const protect = require("../middleware/authMiddleware");
const {
  getStudentProfile,
} = require("../controllers/student/getStudentProfile");
const {
  createStudent,
} = require("../controllers/admin/createStudent.controller");
const {
  getCourseModules,
  getCourseDetails,
  moduleEnrollment,
  GetEnrolledmodules,
} = require("../controllers/student/getCourseModules");
const { getModuleQuizzes } = require("../controllers/student/getModuleQuizzes");

router.get("/progress/:courseId/:studentId", getProgress);
router.post("/progress/lecture", markLectureComplete);
router.post("/progress/tutorial", markTutorialComplete);
router.post("/progress/quiz", markQuizAttempt);
router.post("/progress/assignment", markAssignmentComplete);
router.get("/courses/:courseId/modules/:moduleId/:studentId", getModuleContent);
//router.post("/addStudent", upload.single("image"), addStudent);
router.put("/editStudent/:id", upload.single("image"), editStudent);
router.put("/changePassword/:id", changepassword);
router.get("/student/:studentId", getStudent);
// router.post("/addCourse", addCourse);
// router.get("/courses", Courses);
// router.post("/enroll/:courseId", CourseEnrollment);
// router.get("/enrolled/:studentId", GetEnrolledCourses);
// router.get("/course/:courseId", GetEnrolledCourses);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/student/profile/:id", getStudentProfile);
router.post("/addStudent", upload.single("image"), createStudent);
router.get("/courses/:id/modules", getCourseModules);
router.post("/course", getCourseDetails);
router.post("/enroll/:moduleId", moduleEnrollment);
router.get("/enrolled/:studentId", GetEnrolledmodules);
router.get("/quizzes/module/:id", getModuleQuizzes);

module.exports = router;
