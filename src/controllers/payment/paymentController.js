/**
 * @module Payment
 * Use midtrans snap seamless to handle payment
 */

const prisma = require("../../configs/prismaConfig");
const midtransClient = require("midtrans-client");
const dotenv = require("dotenv");
const { FRONT_END_URL, MIDTRANS_SERVER_KEY } = require("../../utils/constant");

dotenv.config();

/**
 * @function getPaymentById
 * Function to get unique payment
 */

const getPaymentById = async (prisma, paymentCode) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        paymentCode: paymentCode,
      },
    });

    return payment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllPayments = async (prisma) => {
  try {
    const paymentData = await prisma.payment.findMany();

    return paymentData;
  } catch (error) {
    console.error("Error in retrieving payment data: ", error);
    throw error;
  }
};

const getPayment = async (req, res) => {
  const paymentCode = parseInt(req.params.id);
  try {
    if (paymentCode) {
      const payment = await getPaymentById(prisma, paymentCode);
      if (payment) {
        res.status(200).send({
          message: `Success get payment data with id ${paymentCode}`,
          data: payment,
        });
      } else {
        res.status(404).send({
          error: "Payment not found",
        });
      }
    } else {
      const payments = await getAllPayments(prisma);
      res.status(200).send({
        message: "Success get all payments",
        data: payments,
      });
    }
  } catch (error) {}
};

const createPayment = async (req, res) => {
  try {
    const {
      paymentCode,
      productName,
      amount,
      quantity,
      paymentDate,
      bookingId,
    } = req.body;

    const paymentData = await prisma.payment.create({
      data: {
        paymentCode,
        productName,
        amount,
        quantity,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        booking: {
          connect: {
            id: bookingId,
          },
        },
      },
    });

    res.status(200).send({
      message: "Success create payment",
      data: paymentData,
    });
  } catch (error) {
    console.error("Error in generating payment: ", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    res.status(200).send({
      message: `Success delete payment by id:${paymentId}`,
    });
  } catch (error) {}
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
      serverKey: MIDTRANS_SERVER_KEY,
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
      serverKey: MIDTRANS_SERVER_KEY,
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

module.exports = {
  getPayment,
  getAllPayments,
  createPayment,
  getPaymentById,
  deletePayment,
  checkoutPayment,
  getPaymentStatus,
};
