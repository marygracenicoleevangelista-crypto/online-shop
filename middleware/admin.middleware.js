module.exports = function (req, res, next) {
  try {
    // If walang user sa token
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check kung admin ang role
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
