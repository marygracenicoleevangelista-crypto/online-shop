const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

// GET orders (admin or user)
router.get("/", protect, controller.getOrders);

// PLACE order
router.post("/", protect, controller.placeOrder);

// CANCEL order
router.delete("/:orderId", protect, controller.cancelOrder);

module.exports = router;
