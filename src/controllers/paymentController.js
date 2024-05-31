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
    // Request body
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

    const transaction = await snap.createTransaction(parameter);
    res.status(201).send({
      message: "Create payment success",
      token: transaction.token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const status = await snap.transaction.status(order_id);

    res.status(200).send({
      message: `Get status by order id ${order_id} success`,
      data: status,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = { checkoutPayment, getPaymentStatus };
