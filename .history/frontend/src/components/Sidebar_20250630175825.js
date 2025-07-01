import React from "react";
import { FaBars, FaTimes, FaHome, FaUsers, FaEye, FaFileAlt, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ collapsed, toggleSidebar, onNavigate }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? "" : "X"}
      </button>
      <ul>
        <li onClick={() => onNavigate("dashboard")}>📊 Dashboard</li>
        <li onClick={() => onNavigate("users")}>👥 Manage Users</li>
        <li onClick={() => onNavigate("returns")}>🔍 View Returns</li>
        <li onClick={() => onNavigate("page3")}>📄 Page 3</li>
        <li onClick={() => onNavigate("page4")}>📄 Page 4</li>
      </ul>
    </div>
  );
}

export default Sidebar;
