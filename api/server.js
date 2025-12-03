const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/products", require("../routes/product.routes"));
app.use("/api/users", require("../routes/user.routes"));
app.use("/api/cart", require("../routes/cart.routes"));
app.use("/api/orders", require("../routes/order.routes"));
app.use("/api/admin", require("../routes/admin.routes"));

// Swagger
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL })
);

// Root
app.get("/", (req, res) => {
  res.json({ success: true, data: null, message: "Online Shop API is running" });
});

// Connect to MongoDB (Mongoose v9 compatible)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Global error handler
const errorHandler = require("../middleware/error.middleware");
app.use(errorHandler);

module.exports = app;

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}
