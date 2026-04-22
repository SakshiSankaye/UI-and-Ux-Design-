const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const crypto   = require("crypto");
const User     = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hashed, role: role || "student" }).save();
        res.json({ message: "Signup successful" });
    } catch (err) {
        console.log("SIGNUP ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN — returns name, email, role so frontend can store them
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token,
            role: user.role,    // kept for backward compat
            user: {
                id:    user._id,
                name:  user.name,   // ✅ now returned
                email: user.email,  // ✅ now returned
                role:  user.role,
            }
        });
    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken       = token;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const link = `http://localhost:3000/reset-password/${token}`;
        console.log("🔗 RESET LINK (copy to browser):", link);
        res.json({ message: "Reset link logged to server console." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
    try {
        const user = await User.findOne({
            resetToken:       req.params.token,
            resetTokenExpire: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password         = await bcrypt.hash(req.body.password, 10);
        user.resetToken       = undefined;
        user.resetTokenExpire = undefined;
        await user.save();
        res.json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
