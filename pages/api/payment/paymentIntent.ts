import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/products";
import Orders from "../../../models/orderHistory";


const stripeSecretkey = process.env.STRIPE_SECRET_KEY
const emailPass = process.env.EMAILPW
const stripe = new Stripe(stripeSecretkey as string, {
  apiVersion: '2025-02-24.acacia', // Ensure you're using the correct Stripe API version.
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const { paymentMethodId, amount, shippingInfo, billingInfo, storageItemsIDs } = req.body;
      // Check is any of below variables ar not presented  
      if (!paymentMethodId || !amount || !billingInfo) {
        console.log('=======================shippingInfo condition', shippingInfo)
        console.log('=======================paymentMethodId condition', paymentMethodId)
        return res.status(400).json({ success: false, message: 'Missing paymentMethodId' });
      }
      // 1. Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Amount calculates in cents. Example: amount: 1000, means $10.00. that's why we are multiplying it by 100.       
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: false,
        metadata: {
          shippingName: `${shippingInfo.shippingFirstname} ${shippingInfo.shippingLastname}`,
          shippingAddress: `${shippingInfo.shippingAddress}, ${shippingInfo.shippingCity}, ${shippingInfo.shippingState} ${shippingInfo.shippingZipCode}`,
          shippingEmail: shippingInfo.shippingEmail,
          billingName: `${billingInfo.billingFirstname} ${billingInfo.billingLastname}`,
          billingAddress: `${billingInfo.billingAddress}, ${billingInfo.billingCity}, ${billingInfo.billingState}`,
          billingEmail: billingInfo.billingEmail,
          productIds: JSON.stringify(storageItemsIDs || []),
        },
        receipt_email: shippingInfo.shippingEmail,
      });

      // check if payment is NOT created 
      if (!paymentIntent.client_secret) {
        return res.status(400).json({ success: false, message: 'No client secret returned' });
      };
      // 2. Store order in DB
      const createdOrder = await Orders.create({
        product: storageItemsIDs,
        totalAmount: amount,
        viewed: false,
        shippingInfo: { ...shippingInfo },
        billingInfo: { ...billingInfo }
      });
      // 3. Send confirmation email via nodemailer
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
      // 3. finally send the email.
      await smtpTransport.sendMail(mailOptions);
      // Final response to client after all 3 steps are complete
      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        orderID: createdOrder._id
      });




      // const paymentIntentRetrieve = await stripe.paymentIntents.retrieve(paymentIntent.id);


      // console.log('================paymentIntentRetrieve.status', paymentIntentRetrieve.status)
      // const paymentIntentConfirm = await stripe.paymentIntents.confirm(
      //   paymentIntent.id,
      //   { payment_method: paymentMethodId }
      // );
      // console.log('================ppaymentIntentConfirm', paymentIntentConfirm)

      // console.log('================paymentIntent.client_secret', paymentIntent.client_secret); // Check the value
      // res.status(200).json({ clientSecret: paymentIntent.client_secret });
      // return res.status(200).json({
      //   success: true,
      //   clientSecret: paymentIntent.client_secret,
      //   orderID: createdOrder._id
      // });
    } catch (error: any) {
      console.error('Error during PaymentIntent creation:', error);
      res.status(400).json({ success: false });
      // res.status(400).json({ error: error.message });
    }
  } else {
    console.log('====================this should not log')
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}