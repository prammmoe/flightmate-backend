const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/logout", userController.logoutUser);
router.get("/login", userController.loginUser);
router.get("/users", userController.getUsers);

module.exports = router;
