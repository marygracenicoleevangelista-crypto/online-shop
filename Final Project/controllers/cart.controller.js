const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user && req.user._id;
    if (!userId) return res.status(400).json({ success: false, message: "userId required", data: null });

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json({ success: true, data: cart || { userId, items: [] }, message: "Cart fetched" });
  } catch (err) { next(err); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    if (!userId || !productId) return res.status(400).json({ success: false, message: "userId and productId required", data: null });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found", data: null });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find(i => i.productId.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ productId, quantity });

    await cart.save();
    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json({ success: true, data: populated, message: "Added to cart" });
  } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const productId = req.params.productId; // route uses param
    if (!userId || !productId) return res.status(400).json({ success: false, message: "userId and productId required", data: null });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found", data: null });

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true, data: cart, message: "Item removed from cart" });
  } catch (err) { next(err); }
};
