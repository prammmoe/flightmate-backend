const prisma = require("../configs/prismaConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

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
        password: hashedPassword,
        role: "CUSTOMER",
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).send({
        message: "Invalid email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }

    req.session.userId = user.id;
    res.status(200).send({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging user: ", error);
    res.status(500).send({
      message: "An error occurred while logging in user",
    });
  }
};

const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({
        message: "Failed to logout user",
      });
    }

    res.status(200).send({
      message: "Logout successful",
    });
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
};