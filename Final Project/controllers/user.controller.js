let users = [
  { id: 1, name: "Elaine", email: "elaine@test.com", password: "1234" }
];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  users.push({
    id: users.length + 1,
    name,
    email,
    password
  });

  res.json({ message: "Registered successfully" });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", user });
};
