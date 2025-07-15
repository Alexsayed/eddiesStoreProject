import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from "next";
import dbConnect from "../lib/dbConnect";
import Orders, { OrderHistoryInterface } from '../models/orderHistory';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { useCart } from '../state/CartContext';
import { loadStripe } from '@stripe/stripe-js';

type Props = {
  order: OrderHistoryInterface
  orderID?: string;
};
// const SuccessPage = ({ order, orderID }: Props) => { //------- original-------------
const SuccessPage = () => {
  const { setCart } = useCart(); // getting  const [cart, setCart] = useState<CartItem[]>([]); from CartContext.tsx so we can update Cart in Navbar  
  const router = useRouter();
  const { query } = useRouter();
  // const { orderID } = router.query;
  const { payment_intent, redirect_status } = router.query;
  const [orderId, setOrderID] = useState<string | null>(null)
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  // // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++

  // useEffect(() => {
  //   // Clear localStorage after payment is successful 
  //   if (typeof window !== 'undefined') {
  //     localStorage.removeItem("items");
  //     setCart([]); // Update/clear the context, triggers re-render
  //   }
  // }, []);
  // // if order is null or order has been viewed before.
  // if (!order) {
  //   return <p>Order not found or already viewed.</p>;
  // }

  // // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++
  console.log('=============router.query', router.query)
  // console.log('=============query', query)
  // console.log('=============order', order)

  const [status, setStatus] = useState('');

  useEffect(() => {
    if (redirect_status === 'succeeded') {
      const { orderID, email } = router.query;
      // console.log('=========clientEmail ', clientEmail);

      if (typeof orderID === 'string') {
        setOrderID(orderID);

      }
      if (typeof email === 'string') {
        setClientEmail(email);
      }
      console.log('=========succeeded: ', redirect_status)
      console.log('=========email: ', email)
      const { pathname } = router;
      console.log('=========succeeded.pathname: ', pathname);
      // setOrderID(router.query.orderID)
      router.replace(pathname, undefined, { shallow: true });
      setStatus('Payment successful!');
    } else if (redirect_status === 'failed') {
      console.log('=========failed: ', redirect_status)

      setStatus('Payment failed. Please try again.');
    } else if (redirect_status) {
      console.log('=========last Payment status: ', redirect_status)

      setStatus(`Payment status: ${redirect_status}`);
    }
  }, [redirect_status]);

  return (
    <div>
      {/* <h1>Thank you dear {order.shippingInfo.shippingFirstname} for shpping with us.</h1>
      <p>Your order ID is: {orderID} </p>
      <p>An Email has been sent to:  🎉{order.shippingInfo.shippingEmail} address.</p>
      <p>Your payment was successful 🎉{JSON.stringify(order)} </p> */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>

        <h1>{status}</h1>
        <p>Your order ID is: {orderId} </p>
        <p>An Email has been sent to this address: {clientEmail}</p>
      </div>
    </div>
  );
};
// // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   await dbConnect();
//   const { orderID } = context.query;
//   if (!orderID || typeof orderID !== 'string' || !mongoose.Types.ObjectId.isValid(orderID.toString())) {
//     return {
//       notFound: true,
//     };
//   }
//   // Find order from DB
//   const orderResult = await Orders.findById({ _id: orderID });
//   // if no orderResult or orderResult.viewed = TRUE, then  we will return nothing. (this way we are not allowing user to visit same again)
//   if (!orderResult || orderResult.viewed) {
//     return {
//       props: {
//         order: null,
//       },
//     };
//   }
//   // now that user visiting this page for first time, we will mark the orderResult.viewed flag to True. to provent revisiting this page with it's data.
//   orderResult.viewed = true;
//   // save the DB.
//   await orderResult.save();
//   const stringifyOrderResult = JSON.parse(JSON.stringify(orderResult));
//   // next up: update  Orders viewed to True so user wont be able to visit same page again.
//   return {
//     props: {
//       order: stringifyOrderResult,
//       orderID: orderID || null,
//     },
//   };
// };
// // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++

export default SuccessPage;
