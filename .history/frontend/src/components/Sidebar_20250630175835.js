import React from "react";
import { FaBars, FaTimes, FaHome, FaUsers, FaEye, FaFileAlt, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ collapsed, toggleSidebar, onNavigate, currentPage }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      {!collapsed && (
        <div className="top-section">
          <input className="search" type="text" placeholder="Search" />

          <ul>
            <li className={currentPage === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}>
              <FaHome /> Overview
            </li>
            <li className={currentPage === "users" ? "active" : ""} onClick={() => onNavigate("users")}>
              <FaUsers /> Manage Users
            </li>
            <li className={currentPage === "returns" ? "active" : ""} onClick={() => onNavigate("returns")}>
              <FaEye /> View Returns
            </li>
            <li className={currentPage === "page3" ? "active" : ""} onClick={() => onNavigate("page3")}>
              <FaFileAlt /> Page 3
            </li>
            <li className={currentPage === "page4" ? "active" : ""} onClick={() => onNavigate("page4")}>
              <FaFileAlt /> Page 4
            </li>
          </ul>
        </div>
      )}

      {!collapsed && (
        <div className="bottom-section">
          <div className="profile-box">
            <img src="https://i.pravatar.cc/150?img=12" alt="profile" />
            <div className="info">
              <strong>Admin</strong>
              <small>admin@returns.com</small>
            </div>
          </div>
          <ul>
            <li><FaQuestionCircle /> Get Help</li>
            <li><FaCog /> Settings</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
