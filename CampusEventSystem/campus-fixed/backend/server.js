const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const path      = require("path");
require("dotenv").config();

const authRoutes         = require("./routes/auth");
const userRoutes         = require("./routes/UserRoutes");
const eventRoutes        = require("./routes/eventRoutes");
const dashboardRoutes    = require("./routes/dashboardRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const attendanceRoutes   = require("./routes/attendanceRoutes");
const uploadRoutes       = require("./routes/uploadRoutes");

const app = express();

// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ── STATIC UPLOADS ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── DATABASE ────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_events";
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        startCronJobs();
    })
    .catch((err) => console.log("❌ MongoDB Error:", err));

// ── CRON JOBS ───────────────────────────────────────────────
function startCronJobs() {
    try {
        const cron         = require("node-cron");
        const Event        = require("./models/Event");
        const Registration = require("./models/Registration");
        const Notification = require("./models/Notification");

        // Run every day at 8:00 AM — send reminders for events tomorrow
        cron.schedule("0 8 * * *", async () => {
            console.log("⏰ Running daily reminder cron...");
            try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const ymd = tomorrow.toISOString().slice(0, 10);

                const events = await Event.find({ date: { $regex: `^${ymd}` }, status: "approved" });
                for (const event of events) {
                    const regs = await Registration.find({ eventId: event._id });
                    for (const reg of regs) {
                        const alreadySent = await Notification.findOne({
                            userId: reg.studentId,
                            eventId: event._id,
                            type: "reminder",
                        });
                        if (!alreadySent) {
                            await Notification.create({
                                userId:  reg.studentId,
                                eventId: event._id,
                                message: `Reminder: "${event.title}" is happening tomorrow (${event.date})${event.time ? " at " + event.time : ""} at ${event.venue || "TBD"}.`,
                                type:    "reminder",
                            });
                        }
                    }
                }
                console.log(`✅ Sent reminders for ${events.length} events`);
            } catch (err) {
                console.error("Cron error:", err.message);
            }
        });

        console.log("✅ Cron jobs started");
    } catch (e) {
        console.warn("node-cron not available, skipping cron setup:", e.message);
    }
}

// ── ROUTES ──────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/events",        eventRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/attendance",    attendanceRoutes);
app.use("/api/upload",        uploadRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ Campus Event Backend Running"));

// ── SERVER ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
