const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        name:       { type: String, default: "" },
        email:      { type: String, default: "" },
        phone:      { type: String, default: "" },
        department: { type: String, default: "" },
        year:       { type: String, default: "" },
        college:    { type: String, default: "" },
    },
    { timestamps: true }
);

// Prevent duplicate registrations
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
