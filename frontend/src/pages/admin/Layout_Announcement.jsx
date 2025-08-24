import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../components/SidebarAdmin";

const Layout_Announcement = () => (
  <>
    <div style={{ display: "flex" }}>
      <SidebarAdmin />
      <div className="admin-content">
        <Outlet />  {/* This renders the child page */}
      </div>
    </div>
  </>
);

export default Layout_Announcement;
