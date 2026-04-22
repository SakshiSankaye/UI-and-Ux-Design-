const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema({
    eventId:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    latitude:  { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius:    { type: Number, default: 100 }, // meters
    active:    { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);
