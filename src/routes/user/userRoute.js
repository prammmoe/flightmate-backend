const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");
const { verifyToken } = require("../../middlewares/auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken, userController.logoutUser);
router.get("/", userController.getUsers);

module.exports = router;
