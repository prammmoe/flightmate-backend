const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/auth");

console.log(verifyToken)

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken, userController.logoutUser);
// router.get("/users", userController.getUsers);

module.exports = router;
