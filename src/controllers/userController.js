const prisma = require("../configs/prismaConfig");
const bcrypt = require("bcrypt");
const session = require();

const Register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).send({
      message: "Password doesn't match",
    });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    res.status(200).send({
      message: "Register success",
    });
  } catch (error) {
    console.error(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getUsers, Register };
