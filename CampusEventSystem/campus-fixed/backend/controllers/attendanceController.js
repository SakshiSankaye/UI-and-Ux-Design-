const Attendance        = require("../models/Attendance");
const AttendanceSession = require("../models/AttendanceSession");
const Registration      = require("../models/Registration");
const Notification      = require("../models/Notification");
const Event             = require("../models/Event");

// Haversine distance in meters
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Helper: parse event date+time into a Date object
function parseEventDateTime(dateStr, timeStr) {
    if (!dateStr) return null;
    try {
        const combined = timeStr ? `${dateStr} ${timeStr}` : dateStr;
        const d = new Date(combined);
        return isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
}

// POST /api/attendance/session — organizer creates session
exports.createSession = async (req, res) => {
    try {
        const { eventId, latitude, longitude, radius } = req.body;

        if (!eventId) return res.status(400).json({ message: "eventId is required" });
        if (latitude == null || latitude === "") return res.status(400).json({ message: "latitude is required" });
        if (longitude == null || longitude === "") return res.status(400).json({ message: "longitude is required" });

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const rad = parseFloat(radius) || 100;

        if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ message: "Invalid latitude or longitude" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Deactivate any previously active sessions for this event
        await AttendanceSession.updateMany({ eventId, active: true }, { active: false });

        const session = await AttendanceSession.create({
            eventId,
            latitude:  lat,
            longitude: lng,
            radius:    rad,
            createdBy: req.user.id,
            active:    true,
        });

        const link = `${process.env.FRONTEND_URL || "http://localhost:3000"}/student/attendance/${session._id}`;

        // Notify all registered students
        const regs = await Registration.find({ eventId });
        const notifPromises = regs.map(r =>
            Notification.create({
                userId:  r.studentId,
                eventId: eventId,
                message: `Attendance is now open for "${event.title}". Click to mark your attendance.`,
                type:    "attendance",
                link,
            }).catch(() => {})
        );
        await Promise.allSettled(notifPromises);

        res.status(201).json({ message: "Session created successfully", session, link });
    } catch (err) {
        console.error("CREATE SESSION ERROR:", err);
        res.status(500).json({ message: "Error creating session: " + err.message });
    }
};

// GET /api/attendance/session/:sessionId — get session info (public for students)
exports.getSession = async (req, res) => {
    try {
        const session = await AttendanceSession.findById(req.params.sessionId)
            .populate("eventId", "title date time endTime venue");
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching session" });
    }
};

// POST /api/attendance/mark — student marks attendance
exports.markAttendance = async (req, res) => {
    try {
        const { sessionId, latitude, longitude } = req.body;
        if (!sessionId || latitude == null || longitude == null)
            return res.status(400).json({ message: "sessionId, latitude and longitude are required" });

        const session = await AttendanceSession.findById(sessionId).populate("eventId");
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (!session.active) return res.status(400).json({ message: "Attendance is closed" });

        // TIME VALIDATION
        const event = session.eventId;
        if (event && event.date) {
            const now = new Date();
            const startDt = parseEventDateTime(event.date, event.time);
            const endDt   = parseEventDateTime(event.date, event.endTime);

            if (startDt) {
                const earlyBuffer = new Date(startDt.getTime() - 30 * 60 * 1000);
                if (now < earlyBuffer) {
                    return res.status(400).json({ message: "Attendance is not open yet" });
                }
            }

            if (endDt && now > endDt) {
                session.active = false;
                await session.save();
                return res.status(400).json({ message: "Attendance is closed" });
            }
        }

        // GEO VALIDATION
        const dist = haversine(
            session.latitude, session.longitude,
            parseFloat(latitude), parseFloat(longitude)
        );
        if (dist > session.radius) {
            return res.status(400).json({
                message: `You are not within the allowed event location. You are ${Math.round(dist)}m away (limit: ${session.radius}m).`,
                distance: Math.round(dist),
            });
        }

        // DUPLICATE CHECK
        const eventId = (event && event._id) ? event._id : session.eventId;
        const existing = await Attendance.findOne({ eventId, userId: req.user.id });
        if (existing) return res.status(400).json({ message: "Attendance already marked" });

        // SAVE RECORD
        const rec = await Attendance.create({
            eventId,
            userId:    req.user.id,
            latitude:  parseFloat(latitude),
            longitude: parseFloat(longitude),
            timestamp: new Date(),
        });

        res.status(201).json({ message: "Attendance marked successfully!", attendance: rec });
    } catch (err) {
        console.error("MARK ATTENDANCE ERROR:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: "Attendance already marked" });
        }
        res.status(500).json({ message: "Error marking attendance" });
    }
};

// GET /api/attendance/event/:eventId — organizer gets attendance list
exports.getEventAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({ eventId: req.params.eventId })
            .populate("userId", "name email")
            .sort({ timestamp: -1 });
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching attendance" });
    }
};

// GET /api/attendance/export/:eventId — download CSV
exports.exportAttendanceCSV = async (req, res) => {
    try {
        const records = await Attendance.find({ eventId: req.params.eventId })
            .populate("userId", "name email")
            .sort({ timestamp: 1 });

        const event = await Event.findById(req.params.eventId);
        const eventName = event ? event.title : req.params.eventId;

        const header = "Name,Email,Event Name,Timestamp";
        const rows   = records.map(r => {
            const name      = (r.userId?.name  || "").replace(/"/g, '""');
            const email     = (r.userId?.email || "").replace(/"/g, '""');
            const evtName   = eventName.replace(/"/g, '""');
            const timestamp = r.timestamp ? new Date(r.timestamp).toLocaleString("en-IN") : "";
            return `"${name}","${email}","${evtName}","${timestamp}"`;
        });
        const csv = [header, ...rows].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="attendance_${req.params.eventId}.csv"`);
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error exporting CSV" });
    }
};

// GET /api/attendance/sessions/:eventId — get sessions for an event (organizer)
exports.getEventSessions = async (req, res) => {
    try {
        const sessions = await AttendanceSession.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching sessions" });
    }
};
