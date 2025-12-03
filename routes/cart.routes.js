const express = require("express");
const router = express.Router();
const controller = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

// GET user's cart
router.get("/", protect, controller.getCart);

// ADD item
router.post("/", protect, controller.addToCart);

// REMOVE item
router.delete("/:productId", protect, controller.deleteCartItem);

module.exports = router;
