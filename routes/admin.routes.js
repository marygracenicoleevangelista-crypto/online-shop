const express = require("express");
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getProducts } = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Admin Product CRUD
router.post("/products", protect, adminOnly, addProduct);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);
router.get("/products", protect, adminOnly, getProducts);

module.exports = router;
