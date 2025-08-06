import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/products";
import Orders from "../../../models/orderHistory";
import stripe from '../../../utils/stripe'
const emailPass = process.env.EMAILPW

// Handle payment intent api
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  // if not a POST request  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { amount, shippingInfo, billingInfo, storageItemsIDs, storedAmount } = req.body;
    if (!amount && (!shippingInfo || !billingInfo)) {  // ⚠️ Validate required fields
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Provide either amount or shipping/billing info.',
      });
    }
    // Handle creating payment intent 
    if (amount && !shippingInfo && !billingInfo) {
      console.log(' amount Info old way:', amount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // amount is in cents       
        currency: 'usd',
        // automatic_payment_methods: { enabled: true }, // if you would like to have old payment method option like: amazon pay, apple pay etc.
        payment_method_types: ['card'], // This uses ONLY card payments and disables all others payment methods like: amazon pay, apple pay etc.
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic'
          }
        }
      });
      // check if payment intent is NOT created 
      if (!paymentIntent.client_secret) {
        return res.status(400).json({ success: false, message: 'No client secret returned' });
      };
      console.log('===============paymentIntent.client_secret', paymentIntent.client_secret)
      // Return paymentIntent.client_secret to frontend.
      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    }
    // Handle order creation + email 
    if (shippingInfo && billingInfo && storageItemsIDs && storedAmount) {
      // Store order info in DB
      const createdOrder = await Orders.create({
        product: storageItemsIDs,
        totalAmount: storedAmount,
        paid: true,
        shippingInfo: { ...shippingInfo },
        billingInfo: { ...billingInfo }
      });
      // Send confirmation email via nodemailer
      const smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo',
        secure: false,
        auth: {
          user: "faridqaher24@yahoo.com",
          // the pass below is yahoo one-time use pass. The real pass won't work for yahoo security reasons                    
          pass: emailPass // your password goes here emailPass
        },
        debug: false,
        logger: true
      });
      // Email properties
      const mailOptions = {
        from: "faridqaher24@yahoo.com",
        to: shippingInfo.shippingEmail,
        subject: "Order confirmation",
        // Body of email.
        text: `Hello ${shippingInfo.shippingFirstname}, \n\n This is a confirmation that we recieved your order.\n Your order number is: ${createdOrder._id}.\n Thank you for shopping with us!\n`
      };
      // finally send the email.
      await smtpTransport.sendMail(mailOptions);
      // Final response to client 
      return res.status(200).json({
        success: true,
        clientEmail: createdOrder.shippingInfo.shippingEmail,
        orderID: createdOrder._id
      });
    }
    //Invalid POST body 
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. Provide either amount or shipping/billing info.',
    });
  } catch (error: any) {
    console.error(' Server Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
}