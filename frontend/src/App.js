import React from "react";
import {Routes, Route} from "react-router-dom";
import "./index.css";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

//layouts
import PublicLayout from "./layouts/PublicLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/AdminLayout";
import Layout_Announcement from "./pages/admin/Layout_Announcement";

//Common Components
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import InstrcutorNavbar from "./components/instructorNavbar";

// Static Pages
import Home from "./pages/static/Home";
import WhoWeAre from "./pages/static/WhoWeAre";
import Programmes from "./pages/static/Programmes";
import News from "./pages/static/News";
import ContactUs from "./pages/static/ContactUs";
import SupportDesk from "./pages/static/SupportDesk";
import SuccessfullyRequest from "./pages/static/SuccessfullyRequest";

// Auth Pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Courses from "./pages/admin/CoursesPage";
import CourseDetails from "./pages/admin/CourseDetails";
import EditCourse from "./pages/admin/EditCourse";
import AddCourse from "./pages/admin/AddCourse";
import AdminSupportDashboard from "./pages/admin/AdminSupportDashboard";

import CreateAnnouncement from "./pages/admin/CreateAnnouncement";
import SendNotification from "./pages/admin/SendNotification";
import Settings from "./pages/admin/Settings";
import ViewAnnouncements from "./pages/admin/ViewAnnouncements";
//import Layout_Announcement from "./pages/admin/Layout_Announcement";
import EditAnnouncement from "./components/EditeAnnouncemet";
import EditNotification from "./components/EditNotification";

import SingleViewSupport from "./pages/admin/SingleViewSupport";
import AdminReportPage from "./pages/admin/AdminReportPage";
import AdminSupport from "./pages/admin/AdminSupport";

import AddInstructor from './pages/admin/AddInstructor';
import ManageInstrutors from './pages/admin/ManageInstrutors';
import EditInsructor from './pages/admin/EditInsructor';
import QuizExam from './pages/admin/QuizExam';
import Quizes from './pages/admin/Quizes';
import Exams from './pages/admin/Exams';

// Student Pages
import SupportForm from "./pages/student/SupportForm";
import SupportList from "./pages/student/SupportList";
import ModulePage from "./pages/student/ModulePage";
import SupportFormStudent from "./pages/student/SupportForm";
import SupportListStudent from "./pages/student/SupportList";
import StudentProfile from "./pages/student/StudentProfile";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import EditProfile from "./pages/student/EditProfile";
import ChangePassword from "./pages/student/ChangePassword";
import Progress from "./pages/student/Progress";
import Questions from "./pages/student/quiz/Questions";
import ConfirmSubmissionPage from "./pages/student/quiz/ConfirmSubmissionPage";
import Dashboard from "./pages/student/Dashboard";
import ProgrammesList from "./pages/student/Program";
import Quiz from "./pages/student/quiz/Quiz";
import { StudentModules } from "./pages/student/StudentModules";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import SemesterDisplay from "./pages/instructor/SemesterDisplay";
import ModuleDisplay from "./pages/instructor/ModuleDisplay";
import UpdateModulePage from "./pages/instructor/UpdateModulePage";
import DiplomaYearDisplay from "./pages/instructor/DiplomaYearDisplay";
import InstructorModuleDisplayPage from "./pages/instructor/InstructorModuleDisplayPage";
import YearDisplayPage from "./pages/instructor/YearDisplayPage";
import SemesterDisplayPage from "./pages/instructor/SemesterDisplayPage";
import AssignmentPerformancePage from "./pages/instructor/AssignmentPerformancePage";
import UserProfilePage from "./pages/instructor/UserProfilePage";
import ResetPasswordPage from "./pages/instructor/ResetPasswordPage";
import PasswordChangedSuccessfulPage from "./pages/instructor/PasswordChangedSuccessfulPage";
import AddModulePage from "./pages/instructor/AddModulePage";
import AssignmentDisplayPage from "./pages/instructor/AssignmentDisplayPage";
import AddAssignmentPage from "./pages/instructor/AddAssignmentPage";
import EditAssignmentPage from "./pages/instructor/EditAssignmentPage";

// Instructor - Quiz
import AddQuiz from "./pages/instructor/AddQuiz";
import QuizList from "./pages/instructor/QuizList";
import UpdateQuiz from "./pages/instructor/UpdateQuiz";
import QuizPerformance from "./pages/instructor/QuizPerformance";

// Instructor - Assignment
import AddAssignment from "./pages/instructor/AddAssignment";
import AddedAssignment from "./pages/instructor/AddedAssignment";
import EditAssignment from "./pages/instructor/EditAssignment";

// Instructor - Announcements
import AddAnnouncement from "./components/AddAnnouncement";
import AddedAnnouncement from "./components/AddedAnnouncement";
import UpdateAnnouncement from "./components/UpdateAnnouncement";

// Lecture materials
import AddLectureMaterial from "./pages/instructor/AddLectureMaterial";
import AddedLectureMaterials from "./pages/instructor/AddedLectureMaterials";
import UpdateLectureMaterial from "./pages/instructor/UpdateLectureMaterial";

// Instructor - Support
import SupportFormInstructor from "./pages/instructor/SupportForm";
import SupportListInstructor from "./pages/instructor/SupportList";
import InstructorSupportDesk from "./pages/instructor/Supportdesk";
import SupportRequest from "./pages/static/SuccessfullyRequest"

function App() {
  return (
    <div>
      <Routes>
        <Route element={<PublicLayout/>}>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/whoweare" element={<WhoWeAre />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/news" element={<News />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/supportdesk" element={<SupportDesk />} />
          <Route  path="/successfully-request" element={<SuccessfullyRequest />} />
        </Route>

        {/*Admin Routes*/}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="singleViewSupport/:id" element={<SingleViewSupport />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="support" element={<AdminSupportDashboard />} />
          <Route path="adminReportPage" element={<AdminReportPage />} />
          <Route path="adminSupport" element={<AdminSupport />} />
          <Route path="addinstructor" element={<AddInstructor />} />
          <Route path="allinstrutors" element={<ManageInstrutors />} />
          <Route path="editinstructor/:id" element={<EditInsructor />} />
          <Route path="quizexam" element={<QuizExam />} />
          <Route path="quizes" element={<Quizes />} />
          <Route path="exams" element={<Exams />} />
          <Route path="create-announcement" element={<CreateAnnouncement />} />
          <Route path="send-notification" element={<SendNotification />} />
          <Route path="settings" element={<Settings />} />
          <Route path="announcements" element={<ViewAnnouncements />} />
          <Route path="" element={<Layout_Announcement />}>
            <Route path="edit-announcement/:id" element={<EditAnnouncement />} />
            <Route path="edit-notification/:id" element={<EditNotification />} />
          </Route>
        </Route>

        {/* Instructor Routes */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard/>} />

          <Route path="/instructor/addquiz" element={<AddQuiz />} />
          <Route path="/instructor/quizlist" element={<QuizList />} />
          <Route path="/instructor/updatequiz/:id" element={<UpdateQuiz />} />
          <Route path="performance/:id" element={<QuizPerformance />} />

          <Route path="/instructor/addannouncement" element={<AddAnnouncement />} />
          <Route path="/instructor/addedannouncement" element={<AddedAnnouncement />} />
          <Route path="/instructor/updateannouncement/:id" element={<UpdateAnnouncement />} />

          <Route path="/instructor/addassignment" element={<AddAssignment />} />
          <Route path="/instructor/added-assignment" element={<AddedAssignment />} />
          <Route path="/instructor/edit-assignment/:id" element={<EditAssignment />} />

          <Route path="/instructor/modules" element={<ModuleDisplay />} />
          <Route path="/instructor/add" element={<AddModulePage />} />
          <Route path="/instructor/modules/edit/:id" element={<UpdateModulePage />} />
          <Route path="/instructor/diploma-years" element={<DiplomaYearDisplay />} />
          <Route path="/instructor/semester" element={<SemesterDisplay />} />
          <Route path="/instructor/years" element={<YearDisplayPage />} />
          <Route path="/instructor/semesters" element={<SemesterDisplayPage />} />
          <Route path="/instructor/modules/:moduleId" element={<InstructorModuleDisplayPage />} />
          <Route path="/instructor/modules/:moduleId/assignments/add" element={<AddAssignmentPage />} />
          <Route path="instructor/modules/:moduleId/assignments/:assignmentId/edit" element={<EditAssignmentPage />} />
          <Route path="instructor/assignments/:assignmentId/performance" element={<AssignmentPerformancePage />} />

          <Route path="/instructor/profile" element={<UserProfilePage />} />
          <Route path="/instructor/reset-password" element={<ResetPasswordPage />} />
          <Route path="/instructor/password-changed-successful" element={<PasswordChangedSuccessfulPage />} />

          {/*<Route path="sucess-request" element={<SucessRequest />} />*/}
          <Route path="/instructor/instructor-support-list" element={<SupportListInstructor />} />
          <Route path="/instructor/supportform" element={<SupportFormInstructor />} />
          <Route path="/instructor/instructor-supportdesk" element={<InstructorSupportDesk />} />
          <Route path="/instructor/successfully-request" element={<SupportRequest />} />
          
          {/* Lecture material page */}
          <Route path="/instructor/add-lecture-material/:courseId" element={<AddLectureMaterial />} />
          <Route path="/instructor/added-lecture-materials/:courseId" element={<AddedLectureMaterials />} />
          <Route path="/instructor/update-lecture-material/:id" element={<UpdateLectureMaterial />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="support-request" element={<SupportFormStudent />} />
          <Route path="support-list" element={<SupportListStudent />} />
          <Route path="supportdesk" element={<SupportDesk />} />
          <Route path="successfully-request" element={<SuccessfullyRequest />} />
          <Route path="mycourses" element={<StudentModules />} />
          <Route path="studentProfile" element={<StudentProfile />} />
          <Route path="enrolledcourses" element={<EnrolledCourses />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="progress" element={<Progress />} />
          <Route path="modulepage" element={<ModulePage />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/questions" element={<Questions />} />
          <Route path="submitQuiz" element={<ConfirmSubmissionPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="programme" element={<ProgrammesList />} />
          <Route path="modules" element={<ModulePage />} />
          <Route path="support-request" element={<SupportForm />} />
          <Route path="support-list" element={<SupportList />} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;