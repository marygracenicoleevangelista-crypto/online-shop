const Product = require("../models/product.model");
const User = require("../models/user.model");

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("ratings.user", "name email");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// RATE PRODUCT
const rateProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findById(req.user.id);
    const alreadyBought = user.purchasedProducts.some(p => p.toString() === productId);
    if (!alreadyBought) return res.status(403).json({ success: false, message: "You can only rate products you purchased" });

    const existing = product.ratings.find(r => r.user.toString() === req.user.id);
    if (existing) return res.status(400).json({ success: false, message: "You already rated this product" });

    product.ratings.push({ user: req.user.id, rating, comment });
    product.updateAverageRating();
    await product.save();

    res.json({ success: true, message: "Rating submitted successfully", data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProduct, addProduct, updateProduct, deleteProduct, rateProduct };
