import React from "react";
import { FaBars, FaTimes, FaHome, FaUsers, FaEye, FaFileAlt, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./Sidebar.css";
import { ReactComponent as Walmart } from './walmart icon.svg';
function Sidebar({ collapsed, toggleSidebar, onNavigate, currentPage }) {
  const menuItems = [
    { icon: <FaHome />, label: "Overview", key: "dashboard" },
    { icon: <FaUsers />, label: "Manage Users", key: "users" },
    { icon: <FaEye />, label: "View Returns", key: "returns" },
    { icon: <FaFileAlt />, label: "Page 3", key: "page3" },
    { icon: <FaFileAlt />, label: "Page 4", key: "page4" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      <div className="top-section">
       
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={currentPage === item.key ? "active" : ""}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : ""} // Tooltip on hover when collapsed
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="label">{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="bottom-section">
        {!collapsed && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
