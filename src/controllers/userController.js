const prisma = require("../configs/prismaConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { JWT_EXP, JWT_SECRET } = require("../utils/constant");

dotenv.config();

/**
 * @function registerUser
 * Function to register user to the application
 */

const registerUser = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  const confirmPassword = req.body.password;

  if (password !== confirmPassword)
    return res.status(400).send({
      message: "Password doesn't match",
    });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNo,
        password: hashedPassword,
      },
    });

    res.status(200).send({
      data: newUser,
      message: "Register success",
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).send({
      message: "An error occurred while registering the user",
    });
  }
};

/**
 * @function loginUser
 * Function to log user to the application
 */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user.email) {
      return res.status(401).send({
        message: "Invalid email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const payload = {
        id: user.id,
        email: user.email,
        phoneNo: user.phoneNo,
        password: user.password,
      };

      const expiresIn = JWT_EXP;

      console.log("JWT_SECRET in login:", JWT_SECRET);

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: expiresIn,
      });

      res.cookie("tokenUser", token, { httpOnly: true });

      res.status(200).send({
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo,
        },
        token: token,
      });

      console.log(token);
    }
  } catch (error) {
    console.error("Error logging user: ", error);
    res.status(500).send({
      message: "An error occurred while logging in user",
    });
  }
};

/**
 * @function logoutUser
 * Function to logout user from the application
 */

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("tokenUser", { httpOnly: true });
    res.status(200).send({
      message: "Logout success",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

/**
 * @function getUsers
 * Function to get all users
 */

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
  }
};

/**
 * @exports module
 * Exports all the function
 */

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
};
