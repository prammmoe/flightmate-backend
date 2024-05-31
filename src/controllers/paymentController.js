/**
 * @module Payment
 * Use midtrans snap seamless to handle payment
 */
const midtransClient = require("midtrans-client");
const dotenv = require("dotenv");
dotenv.config();

/**
 * @function checkoutPayment
 * Function to handle booking when checked out
 */

const checkoutPayment = async (req, res) => {
  try {
    // Request params
    const {
      name,
      phoneNo,
      email,
      paymentCode,
      productName,
      amount,
      quantity,
      paymentDate,
    } = req.body;

    // Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Construct Midtrans minimum params request to generate
    let parameter = {
      transaction_details: {
        order_id: paymentCode,
        gross_amount: amount * quantity,
        paymentDate: paymentDate,
      },
      item_details: [
        {
          name: productName,
          price: amount,
          quantity: quantity,
        },
      ],
      customer_details: {
        name: name,
        phone: phoneNo,
        email: email,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    console.log("Payment token", token);
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = { checkoutPayment };
