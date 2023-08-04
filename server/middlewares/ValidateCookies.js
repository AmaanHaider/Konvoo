const jwt = require("jsonwebtoken");

const ValidateCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("JWT_TOKEN", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite:"strict"
  });
  return token
};
module.exports = ValidateCookies;
