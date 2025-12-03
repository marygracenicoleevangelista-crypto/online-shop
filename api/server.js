const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");

const app = express();

// CONFIGURATION
mongoose.set("strictQuery", false);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; 
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// DATABASE CONNECTION MIDDLEWARE
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// SWAGGER UI
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customSiteTitle: "Online Shop API Docs",
    customCss: `
      .swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }
      .swagger-ui .scheme-container { display: none; } 
    `,
    swaggerOptions: { persistAuthorization: true }
  })
);

// ROUTES
app.use("/api/products", require("../routes/product.routes"));
app.use("/api/users", require("../routes/user.routes"));
app.use("/api/cart", require("../routes/cart.routes"));
app.use("/api/orders", require("../routes/order.routes"));
app.use("/api/admin", require("../routes/admin.routes"));

// Root Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Online Shop API is running properly!" });
});

// Global error handler
const errorHandler = require("../middleware/error.middleware");
app.use(errorHandler);

module.exports = app;

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    connectDB(); // Connect immediately in local
    console.log(`Server running at http://localhost:${PORT}`);
  });
}