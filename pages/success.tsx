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
// handle successful payment page
const SuccessPage = () => {
  const { setCart } = useCart(); // getting  const [cart, setCart] = useState<CartItem[]>([]); from CartContext.tsx so we can update Cart in Navbar  
  const router = useRouter();
  const [orderId, setOrderID] = useState<string | null>(null)
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [checkingQuery, setCheckingQuery] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!router.isReady) return; // Wait until query params are available
    const { orderID, email, payment_intent, redirect_status } = router.query;

    if (!redirect_status) {  // stop users from manually viewing /success route.                 
      router.replace('/'); // go to landing page
      return;
    };

    if (redirect_status === 'succeeded') {
      // validate OrderID and Email 
      const validOrderID = typeof orderID === 'string' && orderID.trim() !== '';
      const validEmail = typeof email === 'string' && email.trim() !== '';

      if (validOrderID) {
        setOrderID(orderID as string);
      }
      if (validEmail) {
        setClientEmail(email as string);
      }

      // Only proceed to clear cart when both values are true/present
      if (validOrderID && validEmail) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("items");
          setCart([]); // Update/clear the context
        }
      }
      setStatus('Payment successful!');
      // Replace URL to avoid exposing query parameters on refresh
      router.replace(router.pathname, undefined, { shallow: true });

    } else if (redirect_status === 'failed') {
      setStatus('Payment failed. Please try again.');
    } else {
      setStatus(`Payment status: ${redirect_status}`);
    }

    setCheckingQuery(false); // mark query check as done. 
  }, [router.isReady]);

  // Prevent any render until the redirect logic is resolved
  if (checkingQuery) {
    return null; // or return <LoadingSpinner />
  }

  return (
    <div className="w-full  mt-10 md:mt-0 border-t md:border-none text-center ">
      <div className="pt-4   ">
        <h1 className='text-lg leading-9'>Thank You For Your Purchase!</h1>
        <p className='leading-7'>Your order ID is: {orderId}  </p>
        <p className='leading-7'>An email has been sent to this address: {clientEmail}</p>
      </div>
    </div>
  );
};
export default SuccessPage;
