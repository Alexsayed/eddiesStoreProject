import { createContext, useState, useEffect } from 'react';
import product, { Products } from "../../models/products";
import { useCart } from '../../state/CartContext';
import Link from "next/link";
import { BsPen, BsTrash } from "react-icons/bs";


interface CartItem {
  id: string;
  productName: string;
  price: number;
  productImg: string;
  category: string;
  brand: string;
  gender: string;
  colors: string;
  size: string;
  quantity: number;
  inStock: number
}
// handle shopping cart.
const Cart = () => {
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setTotal] = useState<number>(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const getStorage: string | null = localStorage.getItem('items');
      if (getStorage !== null) {
        try {
          const parsedCartItems = JSON.parse(getStorage);
          let getTotal = 0;
          // Sum up prices
          for (let i = 0; i < parsedCartItems.length; i++) {
            getTotal += (parsedCartItems[i].price * parsedCartItems[i].quantity);
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
    // Cleanup function to reset the total when the component unmounts/leaving the page
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

  return (
    <>
      {storedItems.length === 0 ? (
        <p>Shopping Cart is Empty</p>
      ) : (
        <>
          <div className=" relative top-[40px] md:top-0 md:top-0  border-t md:border-none overflow-hidden">
            <div className=" w-full   ">
              <div className="md:grid md:grid-cols-3 md:gap-2  ">
                <div className="md:col-span-2  h-auto">
                  <div className='grid grid-cols-4 gap-2 border-b p-2'>
                    <h1 className="text-xl font-semibold col-span-3 ">Shopping Bag</h1>
                    <p className='text-right  '>Price</p>
                  </div>
                  <ul className='p-1 text-sm sm:text-base'>
                    {storedItems.map((item, index) => (
                      <li key={index} className='  grid grid-cols-6 gap-1 border-b mb-1 pb-1'>
                        <div className=' flex col-span-5  p-1 '>
                          <Link href={item.id} className=''>
                            <img className=' w-36 h-36  min-w-36 min-h-36  sm:w-[200px] sm:h-[200px]  sm:min-w-[200px] sm:min-h-[200px] object-cover rounded ' src={item.productImg} alt="" />
                          </Link>
                          <div className='flex flex-col ml-2'>
                            <Link href={item.id} className=' h-[40px] sm:h-[100px] overflow-hidden  line-clamp-2 sm:line-clamp-4'>
                              <p className='  '>{item.productName} ahahah ahhahaha ddjhadj jdjadhj ahhaha hahahah aajjaj aajjaj aajjaj aajjaj aajjaj aajjaj aajjaj aajjaj aajjaj aajjaj FARID</p>
                            </Link>
                            {item.inStock ? (
                              <p className='text-green-500 text-xs mb-auto'>In Stock</p>
                            ) : (
                              <p className='text-red-500 text-sm mb-1'>Out of Stock</p>
                            )}
                            <div className='  flex items-center'>
                              <p className='inline-block '>Color:</p>
                              <p className="size-3.5 sm:size-4 inline-block ml-2 " style={{ background: `${item.colors}`, boxShadow: '0px 0px 0.5px 0.5px grey' }}></p>
                            </div>
                            <div className=''>Size: {item.size}</div>
                            <div className='  flex items-center '>
                              <p className=''> Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                        <div className=' flex flex-col sm:col-span-1 py-1  items-end justify-between h-full '>
                          <p>${item.price}.00</p>
                          <button className='border rounded-lg bg-red-500  text-white text-center py-1 px-2 w-[35px] mr-2 ' onClick={() => removeAnItem(item.id)}><BsTrash className='mx-auto ' /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-1 border h-auto bg-gray-200 rounded'>
                  <div className='p-6 text-center flex flex-col gap-2 bg-white rounded m-0.5'>
                    <p>Subtotal ({storedItems.length} items): ${checkoutTotal}.00 </p>
                    <Link href={'/checkout/payment'} className='text-center '>
                      <p className='border bg-green-400 rounded-lg mx-auto '>Checkout</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
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