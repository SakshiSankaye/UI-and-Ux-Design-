const Event        = require("../models/Event");
const User         = require("../models/User");
const Registration = require("../models/Registration");

// ── Organizer dashboard stats ──────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        const totalEvents       = await Event.countDocuments();
        const totalParticipants = await User.countDocuments({ role: "student" });
        const upcomingEvents    = await Event.countDocuments({
            status: "approved",
            date:   { $gte: new Date().toISOString().slice(0, 10) }
        });

        const latestEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(4);

        const activities = latestEvents.map((event) => ({
            title: `Event: ${event.title}`,
            desc:  `Venue: ${event.venue || "TBD"} · Status: ${event.status}`,
            tag:   event.status === "approved" ? "Live" : event.status === "pending" ? "Pending" : "Rejected"
        }));

        res.json({ totalEvents, totalParticipants, upcomingEvents, activities });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── Admin stats ────────────────────────────────────────────
const getAdminStats = async (req, res) => {
    try {
        const users        = await User.countDocuments();
        const events       = await Event.countDocuments();
        const pendingCount = await Event.countDocuments({ status: "pending" });

        // Count from Registration model (accurate)
        const registrations = await Registration.countDocuments();

        res.json({ users, events, registrations, pendingCount });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getAdminStats };
