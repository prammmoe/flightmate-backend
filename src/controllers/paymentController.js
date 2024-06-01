/**
 * @module Payment
 * Use midtrans snap seamless to handle payment
 */

const prisma = require("../configs/prismaConfig");
const midtransClient = require("midtrans-client");
const dotenv = require("dotenv");
const { FRONT_END_URL } = require("../utils/constant");

dotenv.config();

/**
 * @function getPaymentById
 * Function to get unique payment
 */

const getPaymentById = async (req, res) => {
  try {
    const paymentCode = parseInt(req.query.paymentCode);

    const payment = await prisma.payment.findUnique({
      where: {
        paymentCode: paymentCode,
      },
    });

    res.status(200).send({
      message: "Success get payment",
      data: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

/**
 * @function checkoutPayment
 * Function to handle booking when checked out
 */

const checkoutPayment = async (req, res) => {
  try {
    // Request body populated from GET /bookings
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
      callbacks: {
        finish: `${FRONT_END_URL}`,
        error: `${FRONT_END_URL}`,
        pedning: `${FRONT_END_URL}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(201).send({
      message: "Create payment success",
      token: transaction.token,
      redirect: parameter.callbacks,
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
    const payment = parseInt(req.params.order_id);

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const status = await snap.transaction.status(payment.order_id);

    res.status(200).send({
      message: `Get status by order id ${payment} success`,
      data: status,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = { getPaymentById, checkoutPayment, getPaymentStatus };
