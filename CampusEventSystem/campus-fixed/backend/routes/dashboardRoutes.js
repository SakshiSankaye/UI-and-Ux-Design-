const express = require("express");
const router  = express.Router();
const { getDashboardStats, getAdminStats } = require("../controllers/dashboardController");

router.get("/stats",       getDashboardStats);   // /api/dashboard/stats
router.get("/admin/stats", getAdminStats);        // /api/dashboard/admin/stats

module.exports = router;
