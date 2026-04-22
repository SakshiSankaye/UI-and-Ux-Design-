const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    message:   { type: String, required: true },
    type:      { type: String, enum: ["registration", "reminder", "attendance", "general"], default: "general" },
    read:      { type: Boolean, default: false },
    link:      { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
