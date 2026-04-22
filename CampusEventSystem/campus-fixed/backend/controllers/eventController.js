const Event = require("../models/Event");

// CREATE EVENT (Organizer)
exports.createEvent = async (req, res) => {
    try {
        const {
            title, description, date, time,
            venue, category, type, link,
            maxParticipants, deadline, tags, image
        } = req.body;

        if (!title || !date || !venue) {
            return res.status(400).json({ message: "Title, date, and venue are required" });
        }
        if (!image) {
            return res.status(400).json({ message: "Event image is required" });
        }

        const event = new Event({
            title, description, date, time, venue,
            category, type, link, maxParticipants, deadline, tags,
            image,
            organizerId:   req.user.id,
            organizerName: req.user.name || "",
            status: "pending",
            participants: []
        });

        await event.save();
        res.status(201).json({ message: "Event created and sent for admin approval", event });
    } catch (err) {
        console.log("CREATE EVENT ERROR:", err);
        res.status(500).json({ message: "Failed to create event", error: err.message });
    }
};

// GET ALL EVENTS (Admin)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) { res.status(500).json({ message: "Error fetching events" }); }
};

// GET PENDING EVENTS
exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) { res.status(500).json({ message: "Error fetching pending events" }); }
};

// APPROVE EVENT
exports.approveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        event.status = "approved";
        await event.save();
        res.json({ message: "Event approved successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error approving event" });
    }
};

// REJECT EVENT
exports.rejectEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        event.status = "rejected";
        await event.save();
        res.json({ message: "Event rejected successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error rejecting event" });
    }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event deleted" });
    } catch (err) { res.status(500).json({ message: "Error deleting event" }); }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (err) { res.status(500).json({ message: "Error updating event" }); }
};

// GET APPROVED EVENTS
exports.getApprovedEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "approved" }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) { res.status(500).json({ message: "Error fetching events" }); }
};

// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (err) { res.status(500).json({ message: "Error fetching event" }); }
};

// REGISTER FOR EVENT
exports.registerEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.status !== "approved")
            return res.status(400).json({ message: "Event is not open for registration" });

        const alreadyRegistered = event.participants.find(p => p.userId === req.user.id);
        if (alreadyRegistered)
            return res.status(400).json({ message: "Already registered for this event" });

        event.participants.push({
            userId: req.user.id,
            name:  req.user.name || req.body.name || "",
            email: req.user.email || req.body.email || ""
        });
        await event.save();
        res.json({ message: "Registered successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error registering for event" });
    }
};

// GET PARTICIPANTS
exports.getParticipants = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event.participants);
    } catch (err) { res.status(500).json({ message: "Error fetching participants" }); }
};

// GET ORGANIZER'S OWN EVENTS
exports.getOrganizerEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.user.id }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) { res.status(500).json({ message: "Error fetching organizer events" }); }
};

// ADMIN REPORT
exports.getAllEventsReport = async (req, res) => {
    try {
        const events = await Event.find();
        const report = events.map(event => ({
            title: event.title,
            status: event.status,
            date: event.date,
            venue: event.venue,
            totalParticipants: event.participants.length
        }));
        res.json(report);
    } catch (err) { res.status(500).json({ message: "Error generating report" }); }
};
