// utils/stripe.js
import Stripe from 'stripe';
// Stripe.js instance 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia', // Ensure you're using the correct Stripe API version.  

});

export default stripe;