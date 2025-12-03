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
exports.deleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Check if productId is valid
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    // Use MongoDB $pull operator 
    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } },
      { new: true } // Return the updated cart
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, message: "Item removed", data: cart.items });
  } catch (error) {
    next(error);
  }
};