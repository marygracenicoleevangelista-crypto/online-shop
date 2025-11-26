const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { timestamps: true });

// Prevent OverwriteModelError
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

module.exports = Cart;
