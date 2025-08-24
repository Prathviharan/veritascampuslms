import React from 'react';
import {
  FaTachometerAlt, FaChartBar, FaBook, FaChalkboardTeacher,
  FaUsers, FaBullhorn, FaCertificate, FaLifeRing, FaCog
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import '../css/sidebar.css'; // Make sure to import the CSS

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h5 className="logo">Admin Dashboard</h5>
      <ul className="nav-list">
        <li><FaTachometerAlt /><NavLink
            to="/admin"
            className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
          > Dashboard </NavLink></li>

        <li>
          <FaChartBar />
          <NavLink
            to="/admin/adminReportPage"
            className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
          >
              Reports
          </NavLink>
        </li>

        <li>
          <FaBook />
          <NavLink
            to="/admin/courses"
            className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
          >
             Courses
          </NavLink>
        </li>

        <li>
          <FaChalkboardTeacher /> Instructor manage
          <ul>
            <li>Add Instructor</li>
            <li>View all Instructor</li>
          </ul>
        </li>

        <li>
          <FaUsers /> Student manage
          <ul>
            <li>Add Student</li>
            <li>View all Student</li>
          </ul>
        </li>


        <li>
          <NavLink
            to="/admin/announcements"
            className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
          >
          <FaBullhorn /> Announcement
          </NavLink>
        </li>
        
        
        <li><FaCertificate /> Exams & certification</li>
        <li>
          <FaLifeRing />
          <NavLink
            to="/admin/adminSupport"
            className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
          >
            Support
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
          >
          <FaCog /> Settings
          </NavLink>
        </li>


        <li><FaBullhorn /> Announcement</li>
        <li><FaCertificate /> Exams & certification</li>

        <li><FaCog /> Settings</li>

      </ul>
    </div>
  );
};

export default Sidebar;

