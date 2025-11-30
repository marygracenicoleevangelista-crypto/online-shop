// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Shop API",
      version: "1.0.0",
      description: "API for Online Shop (Express + MongoDB)"
    },
    servers: [
      { url: "http://localhost:3000" }
      // add production URL if deployed
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Product: {
          type: "object",
          required: ["name", "price", "stock"],
          properties: {
            _id: { type: "string", description: "Auto-generated ID" },
            name: { type: "string", example: "Off-White Diagonal Logo Tee" },
            description: { type: "string", example: "Black tee with signature diagonal stripes" },
            price: { type: "number", example: 24950 },
            stock: { type: "number", example: 20 },
            category: { type: "string", example: "Luxury Streetwear" }
          }
        }
        // add other schemas like User, Cart, Order if needed
      }
    },
    security: [
      { bearerAuth: [] } // global JWT security
    ]
  },
  apis: ["./routes/*.js"] // reads JSDoc in routes
};

const spec = swaggerJsdoc(options);
module.exports = spec;
