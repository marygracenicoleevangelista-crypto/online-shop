let cart = [];

exports.getCart = (req, res) => {
  res.json(cart);
};

exports.addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.json(cart);
};

exports.removeFromCart = (req, res) => {
  const productId = parseInt(req.params.productId);

  cart = cart.filter((item) => item.productId !== productId);

  res.json(cart);
};
