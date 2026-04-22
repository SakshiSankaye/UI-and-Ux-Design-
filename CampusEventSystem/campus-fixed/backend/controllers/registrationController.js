const mongoose     = require("mongoose");
const Registration = require("../models/Registration");
const Event        = require("../models/Event");
const User         = require("../models/User");
const Notification = require("../models/Notification");

// ── POST /api/registrations  ─────────────────────────────────
exports.registerStudent = async (req, res) => {
    try {
        const { eventId, name, email, phone, department, year, college } = req.body;
        const studentId = req.user.id;

        if (!eventId) return res.status(400).json({ message: "eventId is required" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.status !== "approved")
            return res.status(400).json({ message: "Event is not open for registration" });

        const user = await User.findById(studentId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const existing = await Registration.findOne({ studentId, eventId });
        if (existing)
            return res.status(400).json({ message: "Already registered for this event" });

        const registration = await Registration.create({
            studentId,
            eventId,
            name:       name       || req.user.name  || "",
            email:      email      || req.user.email || "",
            phone:      phone      || "",
            department: department || "",
            year:       year       || "",
            college:    college    || "",
        });

        // Push into event.participants for backward compat
        const alreadyIn = event.participants.find(p => p.userId === studentId.toString());
        if (!alreadyIn) {
            event.participants.push({
                userId: studentId.toString(),
                name:   name  || req.user.name  || "",
                email:  email || req.user.email || "",
            });
            await event.save();
        }

        // 🔔 Send registration notification
        try {
            await Notification.create({
                userId:  studentId,
                eventId: eventId,
                message: `You have successfully registered for "${event.title}" on ${event.date}.`,
                type:    "registration",
            });
        } catch (ne) { console.error("Notif error:", ne.message); }

        // Return populated registration
        const populated = await Registration.findById(registration._id)
            .populate("eventId", "title date time venue category image status description");

        const out = populated.toObject();
        out._id = out._id.toString();
        out.studentId = out.studentId.toString();
        if (out.eventId?._id) out.eventId._id = out.eventId._id.toString();

        res.status(201).json({ message: "Registered successfully", registration: out });
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: "Already registered for this event" });
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Error registering", error: err.message });
    }
};

// ── GET /api/registrations/student/:id  ──────────────────────
exports.getStudentRegistrations = async (req, res) => {
    try {
        const rawId = req.params.id;
        let studentObjId;
        try { studentObjId = new mongoose.Types.ObjectId(rawId); }
        catch { return res.status(400).json({ message: "Invalid student ID format" }); }

        const regs = await Registration.find({ studentId: studentObjId })
            .populate("eventId", "title date time venue category image status description")
            .sort({ createdAt: -1 });

        const normalized = regs.map(reg => {
            const obj = reg.toObject();
            obj._id       = obj._id.toString();
            obj.studentId = obj.studentId.toString();
            if (obj.eventId && obj.eventId._id)
                obj.eventId._id = obj.eventId._id.toString();
            return obj;
        });

        res.json(normalized);
    } catch (err) {
        console.error("GET STUDENT REGS ERROR:", err);
        res.status(500).json({ message: "Error fetching registrations" });
    }
};

// ── GET /api/registrations/my  ──────────────────────────────
exports.getMyRegistrations = async (req, res) => {
    req.params.id = req.user.id;
    return exports.getStudentRegistrations(req, res);
};

// ── GET /api/registrations/event/:eventId  ───────────────────
exports.getEventParticipants = async (req, res) => {
    try {
        const { eventId } = req.params;
        const regs = await Registration.find({ eventId })
            .populate("studentId", "name email role")
            .sort({ createdAt: -1 });
        res.json(regs);
    } catch (err) {
        console.error("GET EVENT PARTICIPANTS ERROR:", err);
        res.status(500).json({ message: "Error fetching participants" });
    }
};
