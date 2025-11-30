const Product = require("../models/product.model");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products, message: "Products fetched" });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, data: null, message: "Product not found" });
    res.json({ success: true, data: product, message: "Product fetched" });
  } catch (err) { next(err); }
};

exports.addProduct = async (req, res, next) => {
  try {
    const p = new Product(req.body);
    const newP = await p.save();
    res.status(201).json({ success: true, data: newP, message: "Product created" });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
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
