const Notification = require("../models/Notification");

// GET /api/notifications — get all for logged-in user
exports.getMyNotifications = async (req, res) => {
    try {
        const notifs = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("eventId", "title date");
        res.json(notifs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        res.json({ message: "All marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// Internal helper — create a notification
exports.createNotification = async ({ userId, eventId, message, type, link }) => {
    try {
        await Notification.create({ userId, eventId, message, type: type || "general", link: link || "" });
    } catch (err) {
        console.error("createNotification error:", err.message);
    }
};
