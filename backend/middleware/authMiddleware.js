const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      // Log unexpected errors
      console.error("JWT verification error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = authenticate;