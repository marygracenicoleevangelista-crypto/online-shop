const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// GET orders
exports.getOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.isAdmin) orders = await Order.find();
    else orders = await Order.find({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// PLACE order
exports.placeOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ userId: req.user.id, items, total, status: "Pending" });
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] }); // clear cart
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// CANCEL order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!req.user.isAdmin && order.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    order.status = "Cancelled";
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
