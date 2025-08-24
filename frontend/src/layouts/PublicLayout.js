import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => (
  <>
    <Navbar />

    <div className="public-content">
      <Outlet />
    </div>
  </>
);

export default PublicLayout;
