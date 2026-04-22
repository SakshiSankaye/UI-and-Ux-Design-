import React from "react";
import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";
import "../styles/dashboard.css";

function StudentProfile(){

  const user = JSON.parse(localStorage.getItem("user")) || {};
  return(

    <div className="dashboard">

      <StudentSidebar/>

      <div className="main">

        <Header/>

        <div className="content">

          <div className="page-title">My Profile</div>

          <div className="profile-card">

            <div className="profile-avatar">
  {user?.name ? user.name.charAt(0) : "U"}
</div>

            <h2>{user?.name || "User"}</h2>
<p>{user?.email || "No Email"}</p>
<p>{user?.role || "Student"}</p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default StudentProfile;