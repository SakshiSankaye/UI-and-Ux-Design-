/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrganizerDashboard() {

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    activities: []
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        name: storedUser.name || "Guest",
        email: storedUser.email || "No Email",
        role: storedUser.role || "User"
      });
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔹 HEADER / WELCOME */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-gray-500">Your digital stage is ready 🚀</p>
      </div>

      {/* 🔹 STATS CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Events</p>
          <h2 className="text-2xl font-bold">{stats.totalEvents}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Participants</p>
          <h2 className="text-2xl font-bold">{stats.totalParticipants}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Upcoming Events</p>
          <h2 className="text-2xl font-bold">{stats.upcomingEvents}</h2>
        </div>

      </div>

      {/* 🔹 QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = "/organizer/create-event"}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Event
          </button>

          <button
            onClick={() => window.location.href = "/organizer/manage-events"}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Manage Events
          </button>

          <button
            onClick={() => window.location.href = "/organizer/participants"}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Participants
          </button>
        </div>
      </div>

      {/* 🔹 RECENT ACTIVITY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

        {stats.activities.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          stats.activities.map((item, index) => (
            <div key={index} className="mb-3 border-b pb-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}