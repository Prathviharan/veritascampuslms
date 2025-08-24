import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => (
  <>
   <div style={{ display: "flex" }}>
    <Sidebar />
    <div className="admin-content">
      <Outlet />
      </div>
    </div>
  </>
);

export default AdminLayout;