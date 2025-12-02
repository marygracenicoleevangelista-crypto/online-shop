const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user", "admin"], default: "user" },
  purchasedProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
