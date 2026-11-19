const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId:    { type: String, required: true, unique: true, trim: true },
        displayName: { type: String, default: "", trim: true },
        email:       { type: String, required: true, trim: true, lowercase: true },
        lastLogin:   { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
