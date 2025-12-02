const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, default: "" },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

// method to update average rating
productSchema.methods.updateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
};

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
