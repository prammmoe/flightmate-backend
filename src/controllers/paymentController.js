/**
 * @module Payment
 * Use midtrans snap seamless to handle payment
 */

const dotenv = require("dotenv");
dotenv.config();

const midtransClient = require("midtrans-client");

// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const checkoutPayment = async (req, res) => {
  // Ini nanti diambil dari table payment

  //   Nanti di-fetch dulu dari table payment di frontend baru dikirim ke sini
  const { id, productName, amount, quantity, paymentDate } = req.body;

  //   Ini parameter yang nanti dikirim ke Midtrans
  let parameter = {
    item_details: {
      name: productName,
      price: amount,
      quantity: quantity,
    },
    transaction_details: {
      order_id: id,
      gross_amount: amount * quantity,
      paymentDate: paymentDate,
    },
  };

  const token = await snap.createTransactionToken(parameter);
  console.log("Payment token", token);
  res.status(200).send({ token });
};

module.exports = { checkoutPayment };
