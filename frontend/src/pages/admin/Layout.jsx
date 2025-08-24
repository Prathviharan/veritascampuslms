import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-10 p-4 sm:ml-64 w-full">
        <Outlet /> {/* This is where your page content will render */}
      </div>
    </div>
  );
};

export default Layout;
