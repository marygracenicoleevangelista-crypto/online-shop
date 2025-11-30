// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

// middleware
app.use(express.json());
app.use(cors()); // adjust origin in production if needed
app.use(helmet());
app.use(morgan("dev"));

// routes
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// basic root
app.get("/", (req, res) => {
  res.json({ success: true, data: null, message: "Online Shop API is running" });
});

// connect mongo
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // recommended options omitted for mongoose v6+; adjust if needed
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
connect();

// global error handler (simple)
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

// export for vercel
module.exports = app;

// local start (only for dev)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
