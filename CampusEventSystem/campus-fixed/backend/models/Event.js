const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    description:    { type: String, default: "" },
    date:           { type: String, required: true },
    time:           { type: String, default: "" },
    endTime:        { type: String, default: "" },   // end time for attendance window
    venue:          { type: String, required: true },
    category:       { type: String, default: "" },
    type:           { type: String, default: "" },
    link:           { type: String, default: "" },
    maxParticipants:{ type: Number, default: 0 },
    deadline:       { type: String, default: "" },
    tags:           { type: String, default: "" },
    image:          { type: String, default: "" },

    organizerId:    { type: String, default: "" },
    organizerName:  { type: String, default: "" },

    // Approval workflow
    status: {
        type:    String,
        enum:    ["pending", "approved", "rejected"],
        default: "pending"
    },

    // Registered students
    participants: [
        {
            userId: { type: String },
            name:   { type: String },
            email:  { type: String }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
