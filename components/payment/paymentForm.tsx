import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { OrderHistoryInterface } from "../../models/orderHistory";
import { useStripe, useElements, PaymentElement, Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
// get USA states data
import usaStates, { USAStates } from "../../staticData/usStates";

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
type FormData = {
  shippingInfo: OrderHistoryInterface['shippingInfo'];
  billingInfo: OrderHistoryInterface['billingInfo'];
};

// handle payment form
const PaymentForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const contentType = "application/json";
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [checkboxError, setCheckboxError] = useState('');
  const [checkUncheck, setCheckUncheck] = useState(false);
  // const [succeeded, setSucceeded] = useState(false);
  const [storageItemsIDs, setStorageItemsIDs] = useState<CartItem[]>([]);
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
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [storedAmount, setStoredAmount] = useState<number>(0);
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
  // Derived overall loading. we will be waiting for Countries API and window.localStorage/CartItems to be loaded.
  const isLoading = loadingCart || loadingCountries;
  // Getting Cart items product IDs.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {

        const getStorage: string | null = localStorage.getItem('items');
        if (getStorage !== null) {
          const parsedCartItems = JSON.parse(getStorage);
          let getProductIDS = [];
          let getTotal = 0;
          for (let i = 0; i < parsedCartItems.length; i++) {
            // push IDs to getProductIDS array.
            getProductIDS.push(parsedCartItems[i].id)
            // Get total price of Cart items
            getTotal += (parsedCartItems[i].price * parsedCartItems[i].quantity);
          }
          setStorageItemsIDs(getProductIDS); // set IDs of the products          
          setStoredAmount(getTotal); // Set total price

        }
      } catch (error) {
        console.error('Error parsing stored items from localStorage', error);
      } finally {
        setLoadingCart(false); // Done loading cart
      }
    } else {
      setLoadingCart(false); // No localStorage, still done
    }
    // Cleanup function to reset the total when the component unmounts
    return () => {
      setStorageItemsIDs([]); // Reset state when leaving the page
      // setLoading(false);

    };
  }, []);
  // fetching Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // The below api is not working for now
        // const res = await fetch('https://restcountries.com/v3.1/all');
        // The below API is fetching north and south america.
        const res = await fetch("https://restcountries.com/v3.1/region/america");
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
        const otherCountries = mappedCountries.filter((country) => country.name !== 'United States')
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
        // setLoading(false);
        setLoadingCountries(false)
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
          if (e.target.value.length === 0) { // if no country is select            
            setIsHiddenShipStates(false); // display select States options            
            setUSStates({});// Remove US States data from the useState.
          } else if (e.target.value !== 'US') { // if its not USA then we would hide select States options.             
            setUSStates({}); // Remove US States data from the useState.            
            setIsHiddenShipStates(true); // Hide USA states <select> element.            
            setIsUSASelected(false); // disable (False) select states (required) attribute.
          } else if (e.target.value === 'US') { // If USA is selected                        
            setUSStates(usaStates); // Add US States data
            setIsHiddenShipStates(false); // display select States options            
            setIsUSASelected(true); // Enable (True) select states (required) attribute.
          }
        }
        // if billing inputs. Billing works the same way as Shipping but with different var names.
      } else if (name.startsWith("bill")) {
        if (e.target.name === 'billingCountry') {
          if (e.target.value.length === 0) { // if no country is select            
            setIsHiddenBillStates(false); // display select States options            
            setUSBillStates({});// Remove US States data from the useState.
          } else if (e.target.value !== 'US') {
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
        if (!isShippingComplete) {
          setCheckboxError("Cannot copy shipping info to billing — some fields are missing.");
          setCheckUncheck(false); // <--- uncheck the checkbox
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
        setCheckUncheck(true); // if above conditions are right then we would allow checkbox to be checked.        
        setIsHidden(true); // hide billing input feilds since we are use shipping info.
        // set the billing <input> required attribute values to FALSE. Since the billing and shipping info is the same
        setIsCheckboxChecked(false);
        // setIsCheckboxChecked(prevState => !prevState);
        setCheckboxError(""); // Empty out error message.
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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    // This is a function that takes the previous state (prevState) and returns the opposite of its current value, effectively toggling it between true and false.
    setIsCheckBoxHidden(prevState => !prevState);
  };

  // Submit Form 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment/paymentIntent', {
        method: 'POST',
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ shippingInfo, billingInfo, storageItemsIDs, storedAmount }),
      });
      const submitData = await response.json(); // Parse the JSON response     
      if (!response.ok) {
        throw new Error(`Failed to send data to server. Status: ${response.status}`);
      }
      // setLoading(true);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // redirect when payment is confirmed 
          return_url: `${window.location.origin}/success?orderID=${submitData.orderID}&email=${submitData.clientEmail}`,
          payment_method_data: {
            billing_details: {
              address: {
                line1: billingInfo.billingAddress,
                line2: billingInfo.billingApt,
                city: billingInfo.billingCity,
                state: billingInfo.billingState,
                country: billingInfo.billingCountry,
                // postal_code:  // Billing postal_code sets automatically when we are entering card info
              },
              // name: billingInfo.billingFirstname + ' ' + billingInfo.billingLastname,
              name: `${billingInfo.billingFirstname} ${billingInfo.billingLastname}`,
              email: billingInfo.billingEmail,
              phone: shippingInfo.shippingPhoneNumber,
            },
          },
        },
      });
      if (error) {
        setMessage('error from bs');
      } else {
        setMessage('An unknown error occurred.');
      }
    } catch (err: any) {
      console.error('Error during submission:', err);
      setMessage('An error occurred: ' + err.message);
    }
    setIsProcessing(false);
  }
  // wait for page to fully load
  if (isLoading) return <p>Page is loading please wait...</p>;

  return (
    <>
      <div className=" relative top-[40px] md:top-0 md:top-0  border-t md:border-none pt-4  overflow-hidden">
        <div className="w-[90%] md:w-[60%] mx-auto">
          <h1 className="text-xl font-semibold text-center">Payment Information</h1>
          <h1 className="text-base font-semibold text-center">Shipping Information</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3 text-sm">
            <div className="flex items-center">
              <label htmlFor="shippingFirstname" className="w-28">Firstname:</label>
              <input type="text" id="shippingFirstname" name='shippingFirstname' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]  " placeholder='Firstname' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingLastname" className="w-28">Lastname:</label>
              <input type="text" id="shippingLastname" name='shippingLastname' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Lastname' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingEmail" className="w-28">Email:</label>
              <input type="email" id="shippingEmail" name='shippingEmail' className="border flex-1 pl-2 focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Email Address' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingAddress" className="w-28">Address:</label>
              <input type="text" id="shippingAddress" name='shippingAddress' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Shipping Address' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingApt" className="w-28">Apt/Floor No:</label>
              <input type="text" id="shippingApt" name='shippingApt' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Apt, Floor. Optional' onChange={handleChange} />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingCountry" className="w-28">Country:</label>
              <select name="shippingCountry" id="shippingCountry" className="border rounded-lg flex-1 pl-2 bg-white h-[30px] truncate" onChange={handleChange} required >
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
            </div>

            <div className={isHiddenShipStates ? 'hidden' : "flex items-center"}>
              <label htmlFor="shippingState" className="w-28">State:</label>
              <select name="shippingState" id="shippingState" className="border rounded-lg flex-1 pl-2 bg-white h-[30px] truncate" onChange={handleChange} required={isUSASelected}  >
                <option value="">Select a State</option>
                {Object.entries(usStates).map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingCity" className="w-28">City:</label>
              <input type="text" id="shippingCity" name='shippingCity' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Shipping City' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingZipCode" className="w-28">Zip Code:</label>
              <input type="number" id="shippingZipCode" name='shippingZipCode' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Shipping Zip Code' onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="shippingPhoneNumber" className="w-28">Phone No.:</label>
              <input type="tel" id="shippingPhoneNumber" maxLength={12} minLength={10} size={12} pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name='shippingPhoneNumber' className="border flex-1 pl-2  focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Phone Number' onChange={handleChange} required />
            </div>
            <div className={isCheckBoxHidden ? 'flex items-center' : 'hidden'}>
              <label htmlFor="billingCheckbox" className="w-28 min-w-28 ">Use shipping info as billing: {checkUncheck.toString()}</label>
              <input type="checkbox" id="billingCheckbox" name='billingCheckbox' className="border flex-1 pl-2 capitalize " onChange={handleChange} checked={checkUncheck} />
            </div>
            {checkboxError && <div className='text-red-500'>{checkboxError}</div>}
            <div className={isHidden ? 'hidden' : ""}>
              <div className=' flex items-center'>
                <label htmlFor="displayBillingInfo" className="w-28">Billing info:</label>
                <div className="   flex-1    flex flex-col  border   rounded-[10px]" id='displayBillingInfo'>
                  <div className="  order-1 flex-auto flex items-center cursor-pointer h-[30px] rounded-[10px]" onClick={handleClick}>
                    <div className={isCheckBoxHidden ? ' chevron-down mx-auto chevron-down90Deg mb-1.5  ' : "chevron-down225Deg chevron-down mx-auto mt-1.5"}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className={isCheckBoxHidden ? 'hidden' : " border border-slate-700 w-[100%] ml-auto"} />
            <div className={isCheckBoxHidden ? 'hidden' : "flex flex-col gap-4 fade-in"} >
              <h1 className="text-base font-semibold text-center" >Billing Information</h1>
              <div className="flex items-center">
                <label htmlFor="billingFirstname" className="w-28">Firstname:</label>
                <input type="text" id="billingFirstname" name='billingFirstname' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Firstname' onChange={handleChange} required={isCheckboxChecked} />
              </div>
              <div className="flex items-center">
                <label htmlFor="billingLastname" className="w-28">Lastname:</label>
                <input type="text" id="billingLastname" name='billingLastname' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Lastname' onChange={handleChange} required={isCheckboxChecked} />
              </div>
              <div className="flex items-center">
                <label htmlFor="billingEmail" className="w-28">Email:</label>
                <input type="text" id="billingEmail" name='billingEmail' className="border flex-1 pl-2 focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Email Address' onChange={handleChange} required={isCheckboxChecked} />
              </div>
              <div className="flex items-center">
                <label htmlFor="billingAddress" className="w-28">Address:</label>
                <input type="text" id="billingAddress" name='billingAddress' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Address' onChange={handleChange} required={isCheckboxChecked} />
              </div>
              <div className="flex items-center">
                <label htmlFor="billingApt" className="w-28">Apt/Floor No:</label>
                <input type="text" id="billingApt" name='billingApt' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='Apt, Floor optional' onChange={handleChange} />
              </div>
              <div className="flex items-center">
                <label htmlFor="billingCountry" className="w-28">Country:</label>
                <select name="billingCountry" id="billingCountry" className="border rounded-lg flex-1 pl-2 bg-white h-[30px] truncate" onChange={handleChange} required={isCheckboxChecked} >
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
              </div>
              <div className={isHiddenBillStates ? 'hidden' : "flex items-center"}>
                <label htmlFor="billingState" className="w-28">State:</label>
                <select name="billingState" id="billingState" className="border rounded-lg flex-1 pl-2 bg-white h-[30px] truncate" onChange={handleChange} required={isCheckboxChecked && isUSABillSelected}  >
                  <option value="">Select a State</option>
                  {Object.entries(usBillStates).map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label htmlFor="billingCity" className="w-28">City:</label>
                <input type="text" name='billingCity' id='billingCity' className="border flex-1 pl-2 capitalize focus:outline focus:outline-[#0570ed] focus:outline-[1px]" placeholder='billing City' onChange={handleChange} required={isCheckboxChecked} />
              </div>
            </div>
            <hr className=" border border-slate-700 w-[100%] ml-auto" />
            <h1 className="text-base font-semibold text-center" >Card Information</h1>
            <div className="flex items-start ">
              <div className="w-full "  >
                <p className='ml-20'>Test Card number: 4242 4242 4242 4242</p>
                <PaymentElement />
              </div>
              {error && <div>{error}</div>}
            </div>
            <div className="flex items-start ">
              <button type="submit" className='btn w-36 mx-auto bg-slate-800 color text-white' disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
