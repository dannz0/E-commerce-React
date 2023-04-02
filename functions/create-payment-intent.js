const { json } = require('react-router-dom');

// domain/.netlify/functions/create-payment-intent
require('dotenv').config();

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (e, context) {
  if (e.body) {
    const { cart, shipping_fee, total_amount } = JSON.parse(e.body);

    const calculateOrderAmount = function () {
      return shipping_fee + total_amount;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: 'usd',
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      };
    }
  }
  return { statusCode: 405, body: 'Only POST Requests Allowed' };
};
