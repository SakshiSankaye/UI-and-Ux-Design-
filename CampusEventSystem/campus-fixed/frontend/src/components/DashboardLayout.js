import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="main-section">

        <Header />

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;