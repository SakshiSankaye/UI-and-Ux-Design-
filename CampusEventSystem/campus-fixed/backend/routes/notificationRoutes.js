const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
    getMyNotifications,
    markRead,
    markAllRead,
    deleteNotification,
} = require("../controllers/notificationController");

router.get("/",            auth, getMyNotifications);
router.put("/read-all",    auth, markAllRead);
router.put("/:id/read",    auth, markRead);
router.delete("/:id",      auth, deleteNotification);

module.exports = router;
