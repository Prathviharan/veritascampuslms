import React from 'react';
import '../css/SidebarAdmin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faBullhorn, 
  faBell, 
  faListAlt,
  faCog 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
          <span>Dashboard</span>
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBullhorn} className="icon" />
            <span>Announcements</span>
          </h2>
          <ul className="section-list">
            <li className="list-item">
              <FontAwesomeIcon icon={faBullhorn} className="icon" />
              <span>Create Announcement</span>
            </li>
            <li className="list-item">
              <FontAwesomeIcon icon={faBell} className="icon" />
              <span>Send Notifications</span>
            </li>
            <li className="list-item">
              <FontAwesomeIcon icon={faListAlt} className="icon" />
              <span>View all Announcements</span>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <ul className="section-list">
            <li className="list-item">
              <FontAwesomeIcon icon={faCog} className="icon" />
              <span>Settings</span>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;