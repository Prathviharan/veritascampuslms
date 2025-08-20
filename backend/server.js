const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

// ------------------ Routes ------------------
// Student
const authRoutes = require("./routes/Student/authRoutes");
const studentSupportRoutes = require("./routes/Student/supportRoute");
const quizAnswersRoute = require("./routes/Student/quizAnswersRoute");
const studentRoutes = require("./routes/student");

// Instructor
const assignmentRoutes = require("./routes/instructor/assignmentRoutes");
const InstructorRoutes = require("./routes/instructor/instructorRoutes");
const instructorSupportRoutes = require("./routes/instructor/LectureSupportRoute");
const announcementRoute = require("./routes/instructor/announcementRoute");
const instructorquizRoutes = require("./routes/instructor/quizRoutes");
const lectureRoutes = require("./routes/instructor/lectureRoutes");
const dashboardRoutes = require("./routes/instructor/dashboardRoutes");
const instructorRoutes = require("./routes/instructor/instructor");
const instructorRoutesV2 = require("./routes/InsructorsRoute");

// Admin
const adminSupportRoutes = require("./routes/adminsupportroutes");
const adminReportRoutes = require("./routes/adminReportRoute");
const courseStatsRoutes = require("./routes/adminCourseStats");
const adminDashboardRoutes = require("./routes/adminDashboard");

// General
const notificationRouter = require("./routes/notification.router");
const announcementRouter = require("./routes/announcement.router");

// ------------------ Config ------------------
dotenv.config();
const app = express();

// ------------------ Middleware ------------------
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ API Routes ------------------

// Auth
app.use("/api/auth", authRoutes);

// Student
app.use("/api/student/support", studentSupportRoutes);
app.use("/api/quizAnswers", quizAnswersRoute);
app.use("/api/students", studentRoutes); // renamed to /students to avoid confusion

// Instructor
app.use("/api/instructor/assignments", assignmentRoutes);
app.use("/api/instructor/modules", InstructorRoutes);
app.use("/api/instructor/support", instructorSupportRoutes);
app.use("/api/instructor/announcement", announcementRoute);
app.use("/api/instructor/quiz", instructorquizRoutes);
app.use("/api/instructor/lecture", lectureRoutes);
app.use("/api/instructor/dashboard", dashboardRoutes);
app.use("/api/instructor", instructorRoutes); // general instructor routes
app.use("/api/instructors", instructorRoutesV2); // v2 routes

// Admin
app.use("/api/admin/support", adminSupportRoutes);
app.use("/api/admin/report", adminReportRoutes);
app.use("/api/admin/course-stats", courseStatsRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Notifications & Announcements
app.use("/api/notification", notificationRouter);
app.use("/api/announcement", announcementRouter);

// ------------------ Database ------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ------------------ Production Frontend ------------------
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
