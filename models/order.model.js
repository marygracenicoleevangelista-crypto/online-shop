const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    items: [orderItemSchema],

    total: { 
      type: Number, 
      required: true 
    },

    status: { 
      type: String, 
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending" 
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "gcash", "card"],
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },

    address: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
