import PaymentForm from '../../components/payment/paymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';

const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;
const stripePromise = loadStripe(stripePubKey as string);
const PaymentPage = () => {
  const [stripeReady, setStripeReady] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  // const elements = stripe.elements({ clientSecret });
  useEffect(() => {
    // Load Stripe asynchronously
    // const stripePromise = loadStripe(stripePubKey as string);

    stripePromise.then((stripeInstance) => {
      console.log('=====sstripeInstance', stripeInstance);
      console.log('=====stripePromise', stripePromise);

      setStripe(stripeInstance);
      setStripeReady(true);
    }).catch((error) => {
      console.error('Error loading Stripe:', error);
      setStripeReady(false);
    });
  }, []);
  // Optionally render a loading state if Stripe is not ready yet
  if (!stripeReady) {
    return <div>Loading Stripe...</div>;
  }
  return (
    <div>
      <h1>Payment Page</h1>
      <Elements stripe={stripePromise} >
        <PaymentForm />
      </Elements>

    </div>
  );
};

export default PaymentPage;