const express = require("express");
const router  = express.Router();

const {
    createEvent,
    getAllEvents,
    getPendingEvents,
    approveEvent,
    rejectEvent,
    deleteEvent,
    updateEvent,
    getApprovedEvents,
    getEventById,
    registerEvent,
    getParticipants,
    getAllEventsReport,
    getOrganizerEvents
} = require("../controllers/eventController");

const auth = require("../middleware/authMiddleware");

// ── PUBLIC ───────────────────────────────────────────────────
router.get("/approved",        getApprovedEvents);
router.get("/report",     auth, getAllEventsReport);

// ── ORGANIZER ────────────────────────────────────────────────
router.post("/create",    auth, createEvent);
router.get("/my-events",  auth, getOrganizerEvents);

// ── ADMIN ────────────────────────────────────────────────────
router.get("/",           auth, getAllEvents);
router.get("/pending",    auth, getPendingEvents);
router.put("/approve/:id",auth, approveEvent);
router.put("/reject/:id", auth, rejectEvent);

// ── SHARED ───────────────────────────────────────────────────
router.get("/:id",             getEventById);
router.put("/:id",        auth, updateEvent);
router.delete("/:id",     auth, deleteEvent);
router.post("/register/:id", auth, registerEvent);
router.get("/participants/:id", auth, getParticipants);

module.exports = router;
