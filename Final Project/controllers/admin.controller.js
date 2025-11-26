const Product = require("../models/product");
const Order = require("../models/order");

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = new Product({ name, description, price, stock, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// View all orders
exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId").populate("userId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
