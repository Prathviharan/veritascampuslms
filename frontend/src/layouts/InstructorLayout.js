import { Outlet } from "react-router-dom";
import InstrcutorNavbar from "../components/instructorNavbar";
import Breadcrumbs from "../components/Breadcrumbs";

const InstructorLayout = () => (
  <>
    <InstrcutorNavbar />
    
    <div className="Instructor-content">
      <Breadcrumbs />
      <Outlet />
    </div>
  </>
);

export default InstructorLayout;
