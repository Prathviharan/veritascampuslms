import React from 'react';
import '../css/SidebarAdmin.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullhorn,
  faBell,
  faListAlt,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

const SidebarAdmin = () => {
  return (
    <div className="sidebar-admin">
      <h1 className="sidebar-title"><NavLink
                      to="/admin/admin-dashboard"
                      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                <span>Dashboard</span>
            </NavLink></h1>
   
            
    

      <div className="sidebar-section">
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faBullhorn} className="icon" />
          <span>Announcements</span>
        </div>
        
        <div className="sub-items">
          <div className="sidebar-item">
            <FontAwesomeIcon icon={faBullhorn} className="icon" />
           
            <NavLink
                      to="/admin/create-announcement"
                      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                <span>Create Announcements</span>
            </NavLink>
          </div>
          
          <div className="sidebar-item">
            <FontAwesomeIcon icon={faBell} className="icon" />
            <NavLink
                      to="/admin/send-notification"
                      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                <span>Send Notifications</span>
            </NavLink>
          </div>
          
          <div className="sidebar-item">
            <FontAwesomeIcon icon={faListAlt} className="icon" />
                        <NavLink
                      to="/admin/announcements"
                      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                <span>View all Announcements</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item">
          <FontAwesomeIcon icon={faCog} className="icon" />
          <NavLink
                      to="/admin/settings"
                      className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>
                <span>Settings</span>
        </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;