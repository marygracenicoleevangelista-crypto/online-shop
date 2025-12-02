const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") orders = await Order.find().populate("items.product").populate("user");
    else orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: "No items provided" });

    let total = 0;
    for (const i of items) {
      const prod = await Product.findById(i.productId);
      if (!prod) return res.status(404).json({ success: false, message: "Product not found" });
      total += prod.price * i.quantity;
    }

    const order = new Order({ user: req.user.id, items: items.map(i => ({ product: i.productId, quantity: i.quantity })), total });
    await order.save();

    // Clear user cart
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });

    await order.deleteOne();
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
