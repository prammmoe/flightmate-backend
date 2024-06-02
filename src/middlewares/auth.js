const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { JWT_SECRET } = require("../utils/constant");

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.tokenUser;
  try {
    if (!token) {
      return res.status(401).jend({
        message: "Unauthorized",
      });
    }

    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("tokenUser", { httpOnly: true });
    res.status(403).send({
      message: "Forbidden",
    });
  }
};

module.exports = { verifyToken };
