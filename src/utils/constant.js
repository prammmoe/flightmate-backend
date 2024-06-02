const PORT = 3000;
const FRONT_END_URL = `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXP;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

module.exports = {
  FRONT_END_URL,
  JWT_SECRET,
  JWT_EXP,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY,
};
