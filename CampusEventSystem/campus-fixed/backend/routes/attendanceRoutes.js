const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
    createSession,
    getSession,
    markAttendance,
    getEventAttendance,
    exportAttendanceCSV,
    getEventSessions,
} = require("../controllers/attendanceController");

router.post("/session",              auth, createSession);
router.get("/session/:sessionId",    getSession);
router.post("/mark",                 auth, markAttendance);
router.get("/event/:eventId",        auth, getEventAttendance);
router.get("/sessions/:eventId",     auth, getEventSessions);
router.get("/export/:eventId",       auth, exportAttendanceCSV);

module.exports = router;
