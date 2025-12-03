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
    const { address, paymentMethod } = req.body; // Address is required

    if (!address) {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    // Get user's cart and populate product details (name, price)
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Transform Cart Items to Order Items
    let orderTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // Skip items where product might have been deleted from DB
      if (!item.productId) continue; 

      const subtotal = item.productId.price * item.quantity;
      orderTotal += subtotal;

      orderItems.push({
        productId: item.productId._id,
        name: item.productId.name, // Assumes Product model has 'name'
        price: item.productId.price, // Assumes Product model has 'price'
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // Create the Order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      total: orderTotal,
      address: address,
      paymentMethod: paymentMethod || "cod", // default to cod if not provided
      status: "pending" // lowercase "pending" matches your model enum
    });

    // Clear the Cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
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
    order.status = "cancelled";
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
