// order.controller.js
const Order = require("../models/order.model");
const Product = require("../models/product.model");

// GET orders
exports.getOrders = async (req, res, next) => {
  try {
    // Admin can view all orders
    if (req.user && req.user.role === "admin") {
      const orders = await Order.find()
        .populate("items.productId")
        .populate("userId");
      return res.json({ success: true, data: orders, message: "Orders fetched" });
    }

    // Regular user: only their orders
    const userId = req.user ? req.user._id : req.query.userId;
    if (!userId) return res.status(400).json({ success: false, data: null, message: "userId required" });

    const orders = await Order.find({ userId }).populate("items.productId");
    res.json({ success: true, data: orders, message: "Orders fetched" });
  } catch (err) {
    next(err);
  }
};

// POST place an order
exports.placeOrder = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : req.body.userId;
    const { items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, data: null, message: "userId and items required" });
    }

    // calculate total and validate stock
    let total = 0;
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ success: false, data: null, message: `Product ${it.productId} not found` });
      if (product.stock < it.quantity) return res.status(400).json({ success: false, data: null, message: `Insufficient stock for ${product.name}` });
      total += product.price * it.quantity;
    }

    // reduce stock
    for (const it of items) {
      await Product.findByIdAndUpdate(it.productId, { $inc: { stock: -it.quantity } });
    }

    const order = new Order({ userId, items, total });
    await order.save();
    const populated = await Order.findById(order._id).populate("items.productId").populate("userId");

    res.status(201).json({ success: true, data: populated, message: "Order placed" });
  } catch (err) {
    next(err);
  }
};

// DELETE cancel an order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Only admin or order owner can cancel
    if (req.user.role !== "admin" && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    // restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    next(err);
  }
};
