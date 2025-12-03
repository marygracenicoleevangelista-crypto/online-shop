const express = require("express");
const router = express.Router();

const { getProducts, getProduct, addProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin routes
router.post("/admin/products", protect, adminOnly, addProduct);
router.put("/admin/products/:id", protect, adminOnly, updateProduct);
router.delete("/admin/products/:id", protect, adminOnly, deleteProduct);


module.exports = router;