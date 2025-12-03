// swagger.js
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Online Shop API",
    version: "1.0.0",
    description: "Full API for Online Shop"
  },
  servers: [
    {
      url: "https://online-shop-deployment-qlux324uy-marygracenicoles-projects.vercel.app",
      description: "Production Server (Vercel)"
    },
    {
      url: "http://localhost:3000",
      description: "Local Development"
    }
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
          _id: { type: "string" },
          name: { type: "string", example: "Nike Air Jordan 1 Retro High OG" },
          description: { type: "string", example: "Premium leather high-top sneaker." },
          price: { type: "number", example: 9590 },
          stock: { type: "number", example: 12 },
          category: { type: "string", example: "Luxury Sneakers" }
        }
      },
      User: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "Nicole" },
          email: { type: "string", example: "nicole@example.com" },
          password: { type: "string", example: "123456" },
          role: { type: "string", example: "user" }
        }
      },
      CartItem: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", example: "64a1f2e8c1a2b3d4567e89f0" },
          quantity: { type: "number", example: 2 }
        }
      },
      OrderItem: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string" },
          quantity: { type: "number" }
        }
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          total: { type: "number" },
          status: { type: "string", example: "Pending" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
              example: {
                name: "Nicole",
                email: "nicole@example.com",
                password: "123456"
              }
            }
          }
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Email already used or invalid data" }
        }
      }
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } },
              example: { email: "nicole@example.com", password: "123456" }
            }
          }
        },
        responses: {
          200: { description: "Login successful, returns token", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          400: { description: "Invalid credentials" }
        }
      }
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        responses: {
          200: { description: "List of products", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } }
        }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get single product",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Product details", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          404: { description: "Product not found" }
        }
      }
    },
    "/api/products/{id}/rate": {
      post: {
        tags: ["Products"],
        summary: "Rate a product (user only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { rating: { type: "number" }, comment: { type: "string" } } }, example: { rating: 5, comment: "Amazing!" } } }
        },
        responses: {
          200: { description: "Rating submitted successfully" },
          400: { description: "Already rated" },
          403: { description: "Cannot rate without purchase" },
          404: { description: "Product not found" }
        }
      }
    },
    "/api/admin/products": {
      get: {
        tags: ["Admin Products"],
        summary: "List all products (admin only)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of products" } }
      },
      post: {
        tags: ["Admin Products"],
        summary: "Create a new product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Product" }, example: { name: "Nike Air Jordan", price: 9590, stock: 12, description: "Premium sneaker", category: "Luxury Sneakers" } } }
        },
        responses: { 201: { description: "Product created successfully" }, 400: { description: "Invalid input" } }
      }
    },
    "/api/admin/products/{id}": {
      put: {
        tags: ["Admin Products"],
        summary: "Update a product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" }, example: { name: "Air Max", price: 4999 } } } },
        responses: { 200: { description: "Product updated" }, 404: { description: "Product not found" } }
      },
      delete: {
        tags: ["Admin Products"],
        summary: "Delete a product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product deleted" }, 404: { description: "Product not found" } }
      }
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get current user's cart",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Cart fetched" } }
      },
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItem" } } } },
        responses: { 201: { description: "Item added to cart" } }
      }
    },
    "/api/cart/{itemId}": {
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Item removed" }, 404: { description: "Cart/item not found" } }
      }
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders (admin) or user orders",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Orders fetched" } }
      },
      post: {
        tags: ["Orders"],
        summary: "Place a new order",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } } } }, example: { items: [{ productId: "64a1f2e8c1a2b3d4567e89f0", quantity: 2 }] } } } },
        responses: { 201: { description: "Order placed" }, 400: { description: "Invalid input or stock issue" } }
      }
    },
    "/api/orders/{orderId}": {
      delete: {
        tags: ["Orders"],
        summary: "Cancel an order (admin or owner only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order cancelled" }, 403: { description: "Not authorized" }, 404: { description: "Order not found" } }
      }
    }
  }
};

module.exports = swaggerSpec;