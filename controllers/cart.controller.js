const Cart = require("../models/cart.model");

// GET user's cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json({ success: true, data: cart?.items || [] });
  } catch (error) {
    next(error);
  }
};

// ADD to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    const index = cart.items.findIndex(item => item.productId.toString() === productId);
    if (index > -1) cart.items[index].quantity += quantity;
    else cart.items.push({ productId, quantity });
    await cart.save();
    res.status(201).json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};

// REMOVE from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ success: true, data: cart.items });
  } catch (error) {
    next(error);
  }
};
