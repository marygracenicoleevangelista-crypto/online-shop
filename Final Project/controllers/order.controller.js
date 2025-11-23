let orders = [];

exports.getOrders = (req, res) => {
  res.json(orders);
};

exports.placeOrder = (req, res) => {
  const { userId, items, total } = req.body;

  const order = {
    id: orders.length + 1,
    userId,
    items,
    total,
    date: new Date()
  };

  orders.push(order);

  res.json(order);
};
