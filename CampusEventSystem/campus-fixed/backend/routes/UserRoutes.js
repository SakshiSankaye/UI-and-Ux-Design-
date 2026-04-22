const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const auth    = require("../middleware/authMiddleware");

// GET all users (admin)
router.get("/", auth, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// GET user by id
router.get("/:id", auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// UPDATE user
router.put("/:id", auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        res.json(user);
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// DELETE user (admin)
router.delete("/:id", auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
