const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    eventId:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    latitude:  { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { timestamps: true });

// Prevent duplicate attendance
attendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
