const authenticateUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

module.exports = authenticateUser;
