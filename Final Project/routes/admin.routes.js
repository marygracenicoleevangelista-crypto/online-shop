const express = require("express");
const router = express.Router();
const {
  addProduct,
  editProduct,
  deleteProduct,
  viewAllOrders
} = require("../controllers/admin.controller");

// Product management
router.post("/products", addProduct);
router.patch("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", viewAllOrders);

module.exports = router;
