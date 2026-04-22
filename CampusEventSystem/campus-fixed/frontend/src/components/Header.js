import React, { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header({ search, setSearch }) {

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const notifications = [
    "🎉 New event: Hackathon",
    "📢 Seminar updated",
    "🏆 Certificate added"
  ];

  return (

    <div className="header">

      {/* 🔥 LOGO */}
      <h2 className="logo">
        Campus Event Management System
      </h2>

      {/* 🔥 RIGHT SIDE */}
      <div className="right-section">

        {/* 🔍 SEARCH WITH ICON */}
        <div className="search-box">
          <FaSearch className="search-icon"/>
          <input
            placeholder="Search events..."
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
          />
        </div>

        {/* 🔔 NOTIFICATION */}
        <div className="icon-box">
          <FaBell 
            className="icon"
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
          />

          {/* 🔴 BADGE */}
          {notifications.length > 0 && (
            <span className="badge">
              {notifications.length}
            </span>
          )}

          {showNotif && (
            <div className="dropdown">
              {notifications.map((n,i)=>(
                <p key={i}>{n}</p>
              ))}
            </div>
          )}
        </div>

        {/* 👤 AVATAR */}
        <div className="icon-box">
          <img
            src={user?.profilePic || "https://i.pravatar.cc/40"}
            alt="profile"
            className="avatar"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
          />

          {showProfile && (
            <div className="dropdown">

              <p className="user-name">
                {user?.name || "User"}
              </p>

              <p className="user-email">
                {user?.email}
              </p>

              <hr/>

              <p onClick={()=>navigate("/profile")}>My Profile</p>
              <p onClick={()=>navigate("/student-settings")}>Settings</p>

              <p className="logout" onClick={()=>{
                localStorage.clear();
                navigate("/");
              }}>
                Logout
              </p>

            </div>
          )}
        </div>

      </div>

    </div>

  );
}

export default Header;