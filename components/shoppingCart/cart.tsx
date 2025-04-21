import { createContext, useState, useEffect } from 'react';
import product, { Products } from "../../models/products";
import { useCart } from '../../state/CartContext';
import Link from "next/link";

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

// handle shopping cart.
const Cart = () => {
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setTotal] = useState<number>(0);
  // next up: sending getTotal to checkout route
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('=================if cart.js')
      const getStorage: string | null = localStorage.getItem('items');
      if (getStorage !== null) {
        try {
          const parsedCartItems = JSON.parse(getStorage);
          let getTotal = 0;
          // Sum up prices
          for (let i = 0; i < parsedCartItems.length; i++) {
            getTotal += parsedCartItems[i].price
          }
          // Set total price of items.
          setTotal(getTotal);
          // Set localStorage items to useState
          setStoredItems(parsedCartItems);
        } catch (error) {
          console.error('Error parsing stored items from localStorage', error);
        }
      }


    }

    // Cleanup function to reset the total when the component unmounts
    return () => {
      setTotal(0); // Reset the total when leaving the page
    };
  }, []);


  // if storedItems are not set yet.
  if (storedItems === null) {
    return <p>Loading...</p>;
  }
  // Removing an Item from shopping cart.
  const removeAnItem = (id: String) => {
    let items: string | null = localStorage.getItem('items');
    if (items !== null) {
      // CartItem[]: is to define the shape of the data.
      let parsedItems: CartItem[] = JSON.parse(items);
      // remove an item from parsedItems[] that matches IDs.
      parsedItems = parsedItems.filter((item) => item.id !== id);
      // set the updates items to useState.
      setStoredItems(parsedItems);
      // Save the updated items back to localStorage.
      localStorage.setItem('items', JSON.stringify(parsedItems));
    }
  }
  // next up: searching for an item.
  return (
    <>
      {storedItems.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <div className=' ' style={{ width: '1200px' }}>
          <div className='h-28 border inline-block' style={{ width: '800px' }}>
            <h1 className='text-2xl'>Shopping Bag</h1>
            <div className=' flex justify-between border-t-2 mt-4' >
              <p className='inline'>Item</p>
              <p className='inline'>Item Price</p>
              <p className='inline'>Quantity</p>
              <p className='inline'>Total Price</p>
            </div>
          </div>
          <div className='inline-block border truncate' style={{ width: '300px', }}>
            Order Summary
            <p>Checkout here </p>
            <p>dddd</p>
            <p>dddd</p>
            <p>Total: {checkoutTotal}</p>
            <Link href={'/checkout/payment'} className='text-center'>
              <p className='border bg-green-400 '>Checkout</p>
            </Link>

          </div>
          <ul className='inline-block ' style={{ width: '800px' }}>
            {storedItems.map((item, index) => (

              <li key={index} className='border-b-2 h-48'>
                <div className='flex justify-between '>
                  <div className='inline-block w-1/4'>
                    <img className=' h-48' src={item.productImg} alt="" />
                  </div>
                  <div className='inline-block w-1/6'>
                    <p>Product Name: {item.productName}</p>
                    <p>Brand: {item.brand}</p>
                    <p>Size: {item.size}</p>
                    <div className=''>
                      Color:<p className="w-4 h-4 inline-block ml-2 " style={{ background: `${item.color}`, boxShadow: '0px 0px 0.5px 0.5px grey' }}></p>
                    </div>
                    <p>Gender: {item.gender}</p>
                    <button className='btn' onClick={() => removeAnItem(item.id)}>Remove Item</button>
                  </div>
                  <div className='inline-block w-1/6'>
                    <p>{item.price}</p>
                  </div>
                  <div className='inline-block w-1/6'>
                    <p>{item.quantity}</p>
                  </div>
                  <div className='inline-block w-1/6'>
                    <p>Quantity * Price</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div >
      )}
    </>
  )
}

// const CartContext = createContext();
// interface CartContextType {
//   addToCart: () => void;
//   // Other properties...
// }
// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     // Load cart items from local storage on component mount
//     const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     setCartItems(storedCartItems);
//   }, []);

//   useEffect(() => {
//     // Save cart items to local storage whenever they change
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product) => {
//     setCartItems([...cartItems, product]);
//   };

//   const removeFromCart = (productId) => {
//     setCartItems(cartItems.filter((item) => item.id !== productId));
//   };
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

export default Cart;