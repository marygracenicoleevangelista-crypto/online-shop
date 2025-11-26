const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// IMPORT ROUTES
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const adminRoutes = require("./routes/admin.routes");

// CONNECT TO MONGO ATLAS
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

// USE ROUTES
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Shop API running at http://localhost:${PORT}`);
});
