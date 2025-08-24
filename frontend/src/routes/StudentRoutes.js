import React from "react";
import { Route } from "react-router-dom";
import SupportForm from "../pages/student/SupportForm";
import SupportList from "../pages/student/SupportList";
import SupportDesk from "../pages/static/SupportDesk";
import SuccessfullyRequest from "../pages/static/SuccessfullyRequest";
import Courses from "../pages/student/Courses";
import StudentProfile from "../pages/student/StudentProfile";
import EnrolledCourses from "../pages/student/EnrolledCourses";
import EditProfile from "../pages/student/EditProfile";
import ChangePassword from "../pages/student/ChangePassword";
import Progress from "../pages/student/Progress";
import ModulePage from "../pages/student/ModulePage";
import Quiz from "../pages/student/quiz/Quiz";
import Questions from "../pages/student/quiz/Questions";
import ConfirmSubmissionPage from "../pages/student/quiz/ConfirmSubmissionPage";
import Dashboard from "../pages/student/Dashboard";
import ProgrammesList from "../pages/student/Program";

const StudentRoutes = () => (
  <>
    <Route path="/support-request" element={<SupportForm />} />
    <Route path="/support-list" element={<SupportList />} />
    <Route path="/supportdesk" element={<SupportDesk />} />
    <Route path="/successfully-request" element={<SuccessfullyRequest />} />
    <Route path="/mycourses" element={<Courses />} />
    <Route path="/studentProfile" element={<StudentProfile />} />
    <Route path="/enrolledcourses" element={<EnrolledCourses />} />
    <Route path="/editProfile" element={<EditProfile />} />
    <Route path="/changepassword" element={<ChangePassword />} />
    <Route path="/progress" element={<Progress />} />
    <Route path="/modulepage" element={<ModulePage />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/quiz/questions" element={<Questions />} />
    <Route path="/submitQuiz" element={<ConfirmSubmissionPage />} />
    <Route path="/student/dashboard" element={<Dashboard />} />
    <Route path="/programme" element={<ProgrammesList />} />
  </>
);

export default StudentRoutes;
