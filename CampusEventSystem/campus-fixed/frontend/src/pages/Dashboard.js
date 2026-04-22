import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import EventCard from "../components/events/EventCard";
import eventService from "../services/eventService";

const Dashboard = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {

    const data = await eventService.getEvents();

    setEvents(data);

  };

  return (

    <DashboardLayout>

      <h1>Welcome, Student 👋</h1>

      <div className="stats">

        <div className="stat-card">
          <h3>Total Events</h3>
          <p>12</p>
        </div>

        <div className="stat-card">
          <h3>Attended</h3>
          <p>5</p>
        </div>

        <div className="stat-card">
          <h3>Certificates</h3>
          <p>3</p>
        </div>

      </div>

      <h2>Upcoming Events</h2>

      <div className="event-grid">

        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;