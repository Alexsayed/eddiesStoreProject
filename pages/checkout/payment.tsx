import { Elements } from '@stripe/react-stripe-js';
// // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// // ======================== NEW HOLD for payment +++++++++++++++++++++++++++++++++++
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import dbConnect from "../../lib/dbConnect";
import { useCart } from '../../state/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useMemo } from 'react';
import PaymentForm from '../../components/payment/paymentForm';
const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;
const stripePromise = loadStripe(stripePubKey as string);
import { OrderHistoryInterface } from "../../models/orderHistory";

// configuring style/CSS of <PaymentElement /> which is in components/payment/paymentForm 
const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Ideal Sans, system-ui, sans-serif',
    spacingUnit: '1.6px',
    borderRadius: '10px',
    gridRowSpacing: '16px'
  }, rules: {
    '.Input:focus': {
      border: '1px solid #0570ed',
      boxShadow: 'none',
    },
  }
} as const;
// type FormData = {
//   shippingInfo: OrderHistoryInterface['shippingInfo'];
//   billingInfo: OrderHistoryInterface['billingInfo'];
// };
export default function PaymentPage() {
  // const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const contentType = "application/json";
  const { cart } = useCart();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    // get total amount of the Cart 
    const getAmount = async () => {
      let getTotal = 0;
      // let getProductIDS = [];
      // Sum up prices
      for (let i = 0; i < cart.length; i++) {
        getTotal += (cart[i].price * cart[i].quantity);
      }
      // Set total price of items.
      setAmount(getTotal);
    }
    getAmount();
  }, [cart]); // depends on cart, not amount


  useEffect(() => {
    if (amount <= 0) return; // return if amount is 0   
    const getClientSecret = async () => {
      try {
        const res = await fetch('/api/payment/paymentIntent', {
          method: 'POST',
          headers: {
            Accept: contentType,
            'Content-Type': contentType,
          },
          body: JSON.stringify({ amount: amount }),
        });
        const data = await res.json();
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret); // getting clientSecret from pages/api/paymentIntent          
          setAmount(0); // Clear the amount after successful fetch
        } else {
          console.error('Client secret not received');
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };
    getClientSecret();
  }, [amount]); // wait for amount to be set

  // Memoize options to avoid unnecessary re-renders
  const options = useMemo(() => {
    return clientSecret ? { clientSecret, appearance, } : undefined;
  }, [clientSecret]);

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      )}
    </>
  );
};

// export default PaymentPage;