const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.addProduct = async (req, res, next) => {
  try {
    const p = new Product(req.body);
    const newP = await p.save();
    res.status(201).json({ success: true, data: newP, message: "Product created (admin)" });
  } catch (err) { next(err); }
};

exports.editProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, data: null, message: "Product not found" });
    res.json({ success: true, data: updated, message: "Product updated" });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, data: null, message: "Product not found" });
    res.json({ success: true, data: null, message: "Product deleted" });
  } catch (err) { next(err); }
};

exports.viewAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("items.productId").populate("userId");
    res.json({ success: true, data: orders, message: "All orders" });
  } catch (err) { next(err); }
};
