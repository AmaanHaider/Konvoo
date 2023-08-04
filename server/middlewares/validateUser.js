const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateUser = async (req, res, next) => {
  try {
    const token = req.cookies.JWT_TOKEN;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(500), json({ message: error.message });
    console.log(error.message);
  }
};
module.exports = validateUser;
