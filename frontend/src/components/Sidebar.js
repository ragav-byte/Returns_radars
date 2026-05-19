import React from "react";
import {
  FaBars,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import "./Sidebar.css";
import { ReactComponent as Walmart } from "./walmart icon.svg";

function Sidebar({
  collapsed,
  toggleSidebar,
  onNavigate,
  currentPage,
  onLogout,
  user,
  isSigningOut,
}) {
  const menuItems = [
    { icon: <FaHome />, label: "Overview", key: "dashboard" },
    { icon: <FaUsers />, label: "Manage Users", key: "users" },
    { icon: <FaClipboardList />, label: "Return Queue", key: "returns" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div>
        <div className="sidebar-header">
          <button className="sidebar-toggle" type="button" onClick={toggleSidebar}>
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <button
          className="sidebar-brand"
          type="button"
          onClick={() => onNavigate("dashboard")}
        >
          <Walmart className="sidebar-logo" />
          {!collapsed ? (
            <span>
              <strong>ReturnsRadar</strong>
              <small>Admin operations</small>
            </span>
          ) : null}
        </button>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-link ${currentPage === item.key ? "active" : ""}`}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : ""}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed ? <span className="label">{item.label}</span> : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="profile-box">
          <span className="profile-avatar">
            {user?.email?.slice(0, 1).toUpperCase()}
          </span>
          {!collapsed ? (
            <div className="info">
              <strong>{user?.email || "Admin user"}</strong>
              <small>{user?.role === "admin" ? "Administrator" : "Team member"}</small>
            </div>
          ) : null}
        </div>

        <button
          className="sidebar-logout"
          type="button"
          onClick={onLogout}
          title="Sign out"
          disabled={isSigningOut}
        >
          <span className="icon">
            <FaSignOutAlt />
          </span>
          {!collapsed ? (
            <span className="label">
              {isSigningOut ? "Signing out..." : "Sign out"}
            </span>
          ) : null}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
