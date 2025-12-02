const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json({ success: true, data: [], message: "Cart empty" });
    res.json({ success: true, data: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const existing = cart.items.find(i => i.product.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    res.status(201).json({ success: true, data: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(i => i._id.toString() === itemId);
    if (index === -1) return res.status(404).json({ success: false, message: "Item not found" });

    cart.items.splice(index, 1);
    await cart.save();
    res.json({ success: true, data: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
