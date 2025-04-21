import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { OrderHistoryInterface } from "../../models/orderHistory";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripe, useElements, PaymentElement, Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
// get USA states data
import usaStates, { USAStates } from "../../staticData/usStates";
const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;
const stripePromise = loadStripe(stripePubKey as string);

const CARD_OPTIONS = {
  // iconStyle: "solid",
  style: {
    base: {
      // iconColor: "#c4f0ff",
      iconColor: "red",
      // color: "#fff",
      color: "red",
      // border: 'solid 1px black',
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    // When the card number, expiration date or CVC values are incorrect
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
    complete: {
      // color: '#42f5a7', // Green when card input is complete
      color: '#42f5a7', // Green when card input is complete
    },
  },
};

interface CartItem {
  id: string;
  productName: string;
  price: number;
  productImg: string;
  category: string;
  brand: string;
  gender: string;
  color: string;
  size: string;
  quantity: number;
}
interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

type CountrySummary = {
  name: string;
  code: string;
};
// still not working.what we soild do it to copy all stripe pages and paste to Chat and find what is wrong
const PaymentForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const contentType = "application/json";
  const [clientSecretFromState, setClientSecret] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');

  const [succeeded, setSucceeded] = useState(false);
  const [checkoutTotal, setTotal] = useState<number>(0);
  const [storageItemsIDs, setStorageItemsIDs] = useState<CartItem[]>([]);
  // const [isHiddenStates, setIsHiddenStates] = useState(false);
  const [isHiddenBillStates, setIsHiddenBillStates] = useState(false);
  const [isHiddenShipStates, setIsHiddenShipStates] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCheckBoxHidden, setIsCheckBoxHidden] = useState(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(true); // Manage <input> required attribute toggling based on weather checkbox is checked or unchecked.
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [usStates, setUSStates] = useState<USAStates>(usaStates); // adding USA states data here.
  const [usBillStates, setUSBillStates] = useState<USAStates>(usaStates); // adding USA states data for billing here.
  const [isUSASelected, setIsUSASelected] = useState(true); // Manage <Select> required attribute toggling based on weather USA is selected or not.
  const [isUSABillSelected, setIsUSABillSelected] = useState(true); // Manage <Select> required attribute toggling based on weather USA is selected or not for billing info.
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setselectedCountry] = useState('US'); // <-- Default country select option is USA
  // const [selectedUSAState, setselectedUSAState] = useState({}); // <-- USA states
  const [shippingInfo, setShippingInfo] = useState<OrderHistoryInterface['shippingInfo']>({
    shippingFirstname: '',
    shippingLastname: '',
    shippingEmail: '',
    shippingAddress: '',
    shippingApt: '',
    shippingCity: '',
    shippingState: '',
    shippingCountry: '',
    shippingZipCode: '',
    shippingPhoneNumber: '',
  });

  const [billingInfo, setBillingInfo] = useState<OrderHistoryInterface['billingInfo']>({
    billingFirstname: '',
    billingLastname: '',
    billingEmail: '',
    billingAddress: '',
    billingApt: '',
    billingCity: '',
    billingState: '',
    billingCountry: '',
    // billingZipCode: '', // not needed 
  });



  // console.log('=========================usaStates', usaStates)
  // const element1 = elements?.create('card', {
  //   style: {
  //     base: {
  //       iconColor: '#c4f0ff',
  //       color: '#fff',
  //       fontWeight: '500',
  //       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
  //       fontSize: '16px',
  //       fontSmoothing: 'antialiased',
  //       ':-webkit-autofill': {
  //         color: '#fce883',
  //       },
  //       '::placeholder': {
  //         color: '#87BBFD',
  //       },
  //     },
  //     invalid: {
  //       iconColor: '#FFC7EE',
  //       color: '#FFC7EE',
  //     },
  //   },
  // });
  // console.log('===========element1,', element1);
  // if (!stripe || !elements) {
  //   return; // Make sure Stripe.js is loaded
  // }



  // Fetch the client secret from your server (e.g., via an API route in Next.js)
  // useEffect(() => {
  //   const fetchClientSecret = async () => {
  //     const res = await fetch('/api/payment/paymentIntent', {
  //       method: 'POST',
  //       headers: {
  //         Accept: contentType,
  //         "Content-Type": contentType,
  //       },
  //       body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
  //     });
  //     const data = await res.json();
  //     console.log('============data from oaymentForm top', data)
  //     setClientSecret(data.clientSecret);
  //   };

  //   fetchClientSecret();
  // }, []);

  // next up: set up a order list history model with its and story all order history in DB
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // console.log('=================if cart.js')
      const getStorage: string | null = localStorage.getItem('items');
      if (getStorage !== null) {
        try {
          const parsedCartItems = JSON.parse(getStorage);
          let getTotal = 0;
          let getProductIDS = [];
          // Sum up prices
          for (let i = 0; i < parsedCartItems.length; i++) {
            getTotal += parsedCartItems[i].price;
            getProductIDS.push(parsedCartItems[i].id)

          }
          // Set total price of items.
          setTotal(getTotal);
          // Get IDs of the products          
          setStorageItemsIDs(getProductIDS);
        } catch (error) {
          console.error('Error parsing stored items from localStorage', error);
        }
      }
    }
    // Cleanup function to reset the total when the component unmounts
    return () => {
      setTotal(0); // Reset the total when leaving the page
      setStorageItemsIDs([]);
    };
  }, []);
  // fetching Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all');
        const data = await res.json();
        // Map through counties data.
        const mappedCountries: CountrySummary[] = data.map((country: Country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        // find United States from the list.
        const unitedStates = mappedCountries.find(
          (country) => country.name === 'United States'
        );
        // Filter out United States and sort the rest
        const otherCountries = mappedCountries
          .filter((country) => country.name !== 'United States')
          .sort((a, b) => a.name.localeCompare(b.name));
        // Put United States at the top
        const sortedCountries = unitedStates
          //If unitedStates exists, we creates a new array starting with unitedStates, followed by all the otherCountries
          ? [unitedStates, ...otherCountries]
          // if NO unitedStates then just return the otherCountries
          : otherCountries;
        // Set sorted counties.
        setCountries(sortedCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);
  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    if (type !== 'checkbox') {
      // if shipping inputs
      if (name.startsWith("shipp")) {
        setShippingInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        // if we are setting countries
        if (e.target.name === 'shippingCountry') {
          // if its not USA then we would hide select States options. 
          if (e.target.value !== 'US') {
            // Remove US States data from the useState.
            setUSStates({});
            // Hide USA states <select> element.
            setIsHiddenShipStates(true);
            // disable (False) select states (required) attribute.
            setIsUSASelected(false);
            // If USA is selected
          } else if (e.target.value === 'US') {
            // Add US States data
            setUSStates(usaStates);
            // display select States options
            setIsHiddenShipStates(false);
            // Enable (True) select states (required) attribute.
            setIsUSASelected(true)
          }
        }
        // if billing inputs. Billing works the same way as Shipping but with different var names.
      } else if (name.startsWith("bill")) {
        if (e.target.name === 'billingCountry') {
          if (e.target.value !== 'US') {
            setUSBillStates({});
            setIsHiddenBillStates(true);
            setIsUSABillSelected(false);
          } else if (e.target.value === 'US') {
            setUSBillStates(usaStates);
            setIsHiddenBillStates(false);
            setIsUSABillSelected(true);
          }
        }
        setBillingInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
      // if checkbox is checked we will set the billing info as shipping.      
    } else if (type === 'checkbox' && name === 'billingCheckbox') {
      if (checked) {
        // Check that all required fields in shippingInfo are filled        
        const requiredFields = [
          'shippingFirstname',
          'shippingLastname',
          'shippingEmail',
          'shippingAddress',
          'shippingCity',
          'shippingCountry',
        ];
        // Add 'shippingState' only if the selected country is US
        if (shippingInfo.shippingCountry === 'US') {
          requiredFields.push('shippingState');
        }
        // check for if any of the required field is not filled. returns boolean 
        const isShippingComplete = requiredFields.every(
          (field) => shippingInfo[field as keyof typeof shippingInfo]?.trim() !== '',
        );
        console.log('==========shippingInfo', shippingInfo)
        console.log('==========requiredFields', requiredFields);
        if (!isShippingComplete) {
          setCheckboxError("Cannot copy shipping info to billing — some fields are missing.")
          return;
        }

        setBillingInfo((prevState) => ({
          ...prevState,
          billingFirstname: shippingInfo.shippingFirstname,
          billingLastname: shippingInfo.shippingLastname,
          billingEmail: shippingInfo.shippingEmail,
          billingAddress: shippingInfo.shippingAddress,
          billingApt: shippingInfo.shippingApt,
          billingCity: shippingInfo.shippingCity,
          billingState: shippingInfo.shippingState,
          billingCountry: shippingInfo.shippingCountry,
          // billingZipCode: shippingInfo.shippingZipCode,
        }));
        // hide billing input feilds since we are use shipping info.
        setIsHidden(true);
        // set the billing <input> required attribute values to FALSE. Since the billing and shipping info is the same
        setIsCheckboxChecked(false);
        // setIsCheckboxChecked(prevState => !prevState);
      } else {
        // Reset billingInfo back to empty string when checkbox is check and then unchecked.
        setBillingInfo({
          billingFirstname: '',
          billingLastname: '',
          billingEmail: '',
          billingAddress: '',
          billingApt: '',
          billingCity: '',
          billingState: '',
          billingCountry: '',
        });
        // When we UNCHECK the checkbox we will set <input> required attribute values back to TRUE.
        setIsCheckboxChecked(true);
        // If checkbox is unchecked then display the billing btn.
        setIsHidden(false);
        // clear the error message
        setCheckboxError('')
      }
    }
  };
  // The below function is to toggle between visibality of Billing btn and input checkbox element, which handles the billing info as shipping info
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // This is a function that takes the previous state (prevState) and returns the opposite of its current value, effectively toggling it between true and false.
    setIsCheckBoxHidden(prevState => !prevState);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return; // Make sure Stripe.js is loaded
    }
    setIsProcessing(true);
    // ===============================on hold===========================================================
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      // Handle the case where the card element is not available
      return;
    }
    // Create payment methpod. This method ID ( const { id } = paymentMethod; ) will go to server.
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      billing_details: {
        address: {
          line1: billingInfo.billingAddress,
          line2: billingInfo.billingApt,
          city: billingInfo.billingCity,
          state: billingInfo.billingState,
          country: billingInfo.billingCountry,
          // postal_code:  // Billing postal_code sets automatically when we are entering card info
        },
        email: billingInfo.billingEmail,
        name: billingInfo.billingFirstname + ' ' + billingInfo.billingLastname,
        phone: shippingInfo.shippingPhoneNumber
      },
      card: cardElement,
    });
    if (paymentMethodError) {
      console.error("Payment method error:", paymentMethodError.message);
      // setError(paymentMethodError.message || "Payment method error");
      setIsProcessing(false);
      return;
    }
    try {
      // Get ID of the stripe.createPaymentMethod({})
      const { id } = paymentMethod;
      // Post data to server.
      const response = await fetch('/api/payment/paymentIntent', {
        method: 'POST',
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ paymentMethodId: id, amount: checkoutTotal, shippingInfo, billingInfo, storageItemsIDs }),
      });
      const data = await response.json(); // Parse the JSON response
      // Checking if payment went successfull. NOTE: clientSecret comes from the server.     
      if (data.clientSecret) {
        // Confirming the payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: id,
        });
        if (confirmError) {
          console.error('Payment confirmation error:', confirmError.message);
          // setError(confirmError.message || 'Payment failed');
        } else if (paymentIntent.status === 'succeeded') {
          setSucceeded(true);
          // Redirect to success page.
          router.push({
            pathname: '/success',
            query: {
              // data.orderID is ID of newly created order.
              orderID: data.orderID,
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };
  // this loading is very important bc it default selects USA where we are selecting countries.
  // without this load check the default select will be empty string.
  if (loading) return <p>Loading countries...</p>;
  // console.log('============selectedCountry', selectedCountry)


  return (
    <>
      <div className='w-full '>
        <p className='ml-20'>Total: {checkoutTotal}</p>
        <p className='ml-20'>4242 4242 4242 4242</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="shippingForm">Shipping Address:</label>
          <div id='shippingForm'>
            <input type="text" name='shippingFirstname' className="capitalize" placeholder='Firstname' onChange={handleChange} required />
            <input type="text" name='shippingLastname' className="capitalize" placeholder='Lastname' onChange={handleChange} required />
            <input type="email" name='shippingEmail' placeholder='Email Address' onChange={handleChange} required />
            <input type="text" name='shippingAddress' className="capitalize" placeholder='Shipping Address' onChange={handleChange} required />
            <input type="text" name='shippingApt' className="capitalize" placeholder='Apt Number, Floor, Building Optional' onChange={handleChange} />
            <select name='shippingCountry' id='shippingCountry' className="border rounded-lg w-full" onChange={handleChange} required>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <React.Fragment key={country.code}>
                  < option key={country.code} value={country.code} >
                    {country.name}
                  </option>
                  {country.name === 'United States' && (
                    // key={`${country.code}-divider`}: gives the below <option> its own unique key, so it won't create conflict with real <options>. bc its used for Border-bottom purpose. 
                    < option key={`${country.code}-divider`} disabled>────────────</option>
                  )}
                </React.Fragment>
              ))}
            </select>
            <select name='shippingState' className={isHiddenShipStates ? 'hidden' : "border rounded-lg w-full"} onChange={handleChange} required={isUSASelected}>
              <option value="">Select a State</option>
              {Object.entries(usStates).map(([abbr, name]) => (
                <option key={abbr} value={abbr}>
                  {name}
                </option>
              ))}
            </select>
            <input type="text" name='shippingCity' className="capitalize" placeholder='Shipping City' onChange={handleChange} required />
            <input type="number" name='shippingZipCode' placeholder='Shipping Zip Code' onChange={handleChange} required />
            <input type="number" name='shippingPhoneNumber' placeholder='Phone Number' onChange={handleChange} required />
            <div className={isCheckBoxHidden ? 'flex items-center' : 'hidden'}>
              <p>condition (cant check the box if no shipping is filed out) setCheckboxError</p>
              <label htmlFor="billingCheckbox" className='  mr-4'>Use shipping info as billing:</label>
              <input type="checkbox" name='billingCheckbox' id='billingCheckbox' className='w-5 mt-2.5 h-6' onChange={handleChange} />
            </div>
          </div>
          {checkboxError && <div>{checkboxError}</div>}
          <div className={isHidden ? 'hidden' : " "}>
            <button type='button' className='btn' onClick={handleClick}>Billing Address</button>
            <p>isCheckBoxHidden: {isCheckBoxHidden.toString()}</p>
            <p>isCheckboxChecked: {isCheckboxChecked.toString()}</p>
            <div className={isCheckBoxHidden ? 'hidden' : " "} >
              <input type="text" name='billingFirstname' className="capitalize" placeholder='Firstname' onChange={handleChange} required={isCheckboxChecked} />
              <input type="text" name='billingLastname' className="capitalize" placeholder='Lastname' onChange={handleChange} required={isCheckboxChecked} />
              <input type="email" name='billingEmail' placeholder='Email Address' onChange={handleChange} required={isCheckboxChecked} />
              <input type="text" name='billingAddress' className="capitalize" placeholder='billing Address' onChange={handleChange} required={isCheckboxChecked} />
              <input type="text" name='billingApt' className="capitalize" placeholder='Apt Number, Floor, Building Optional' onChange={handleChange} />
              <select name='billingCountry' id='shippingCountry' className="border rounded-lg w-full" onChange={handleChange} required={isCheckboxChecked} >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <React.Fragment key={country.code}>
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                    {country.name === 'United States' && (
                      <option key={`${country.code}-divider`} disabled>────────────</option>
                    )}
                  </React.Fragment>
                ))}
              </select>
              <select name='billingState' className={isHiddenBillStates ? 'hidden' : "border rounded-lg w-full"} onChange={handleChange} required={isCheckboxChecked && isUSABillSelected}>
                <option value="">Select a State</option>
                {Object.entries(usBillStates).map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>
                    {name}
                  </option>
                ))}
              </select>
              <input type="text" name='billingCity' className="capitalize" placeholder='billing City' onChange={handleChange} required={isCheckboxChecked} />
            </div>
          </div>
          <CardElement options={CARD_OPTIONS} />
          <button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay'}
          </button>
          {error && <div>{error}</div>}
          {succeeded && <div>Payment successful!</div>}
        </form >
      </div >
    </>
  );
};

export default PaymentForm;
