 
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Error verifying token:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = authenticate;


 