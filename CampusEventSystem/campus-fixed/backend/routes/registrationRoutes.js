const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
    registerStudent,
    getStudentRegistrations,
    getMyRegistrations,
    getEventParticipants,
} = require("../controllers/registrationController");
const { exportPDF, exportExcel } = require("../controllers/exportController");

// POST   /api/registrations              → register student for an event
router.post("/",                       auth, registerStudent);

// GET    /api/registrations/my           → registrations for logged-in student (token-based)
router.get("/my",                      auth, getMyRegistrations);

// GET    /api/registrations/student/:id  → registrations by student ID
router.get("/student/:id",             auth, getStudentRegistrations);

// GET    /api/registrations/event/:eventId  → participants list for an event
router.get("/event/:eventId",          auth, getEventParticipants);

// GET    /api/registrations/export/pdf/:eventId
router.get("/export/pdf/:eventId",     auth, exportPDF);

// GET    /api/registrations/export/excel/:eventId
router.get("/export/excel/:eventId",   auth, exportExcel);

module.exports = router;
