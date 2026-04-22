const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ["student","organizer","admin"], default: "student" },
  phone:      { type: String, default: "" },
  department: { type: String, default: "" },
  year:       { type: String, default: "" },
  college:    { type: String, default: "" },
  profilePic: { type: String, default: "" },
  resetToken:       String,
  resetTokenExpire: Date,
})

module.exports = mongoose.model("User", UserSchema)
