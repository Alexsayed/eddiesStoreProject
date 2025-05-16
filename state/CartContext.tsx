import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// import { GetServerSideProps } from "next";
import dbConnect from "../lib/dbConnect";
import Product, { Products } from "../models/products";

// import Product from "../models/products";
// import { Products } from "../models/products";
// import Size, { ISizes } from '../models/sizes';
// import { ParsedUrlQuery } from "querystring";

// next up instead of CartItem interface we should do Products interface
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
}
type Props = {
  allProductsONHOLD: Products[];
  // sizes:
  // products1: String;

};

interface CartContextType {
  cart: CartItem[];
  // cart: Products[];
  addToCart: (item: CartItem) => void;
  // addToCart: (item: Products) => void;
  setCart: (items: any[]) => void;
}
interface CartProviderProps {
  children: ReactNode;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const context = useContext(CartContext);
  // console.log('=======mf clicked from context', context)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  // const [cart, setCart] = useState<Products[]>([]);
  // ================== new =============================

  // const [storedItems, setStoredItems] = useState<string | null>(null);
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);

  // ================== ON HOLD =============================
  // useEffect(() => {
  //   // Check if we are in the browser
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     let getStorage: string | null = localStorage.getItem('items');
  //     // const getStorage: string | null = localStorage.getItem('items');
  //     // const parsedItems = getStorage ? JSON.parse(getStorage) : [];
  //     // console.log('===== getStorage', JSON.parse(getStorage));


  //     if (getStorage) {
  //       // console.log('No items in cart', JSON.parse(getStorage));
  //       //   console.log('items in cart top', getStorage);
  //       //   // Store it in the state
  //       //   // setStoredItems(JSON.parse(getStorage));

  //       // setCart([JSON.parse(getStorage)]);
  //       setCart(JSON.parse(getStorage));
  //     }
  //   }

  // }, []);
  // ================== ON HOLD =============================

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
      try {
        // Get items from localStorage
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
          // Convert JavaScript value or object 
          const parsedItems = JSON.parse(storedItems);
          setCart(parsedItems);
        }
      } catch (error) {
        console.error('Failed to load items from localStorage:', error);
      }
    }
  }, []);



  // next up: handle so a use can select only 1 color and 1 size per addToCart, if a user want multi size or color then they have add to car new order
  // Add items to Shopping cart.
  const addToCart = (item: CartItem) => {
    // const addToCart = (item: Products) => {
    console.log('=======item', item);
    // Get data from localStorage
    let currentItems: string | null = localStorage.getItem('items');
    // localStorage is storing data as String, so below we need to return it to an Obj. 
    let parsedItems: CartItem[] = currentItems ? JSON.parse(currentItems) : [];
    // let parsedItems: Products[] = currentItems ? JSON.parse(currentItems) : [];

    // // ================== ON HOLD =============================
    // if there is no data in the localStorage, then add data to localStorage and setState.
    if (currentItems === null || undefined) {

      // // ================== ON HOLD =============================
      localStorage.setItem('items', JSON.stringify([item]));
      // localStorage.setItem('items', JSON.stringify([item + 'quantity: 1']));
      // set the state so we can see the update in the navBar.tsx at shopping cart section.
      setCart([item]);
      // // ================== ON HOLD =============================

    } else {
      console.log('=======parsedItems', parsedItems);

      // find the matching ID of stored data and new data.
      // const existingItem = parsedItems.find(cartItem => cartItem.id === item.id);
      const existingItem = parsedItems.find(cartItem => cartItem.id === item.id);
      const matchingColor = parsedItems.find(cartItem => cartItem.colors === item.colors);
      const matchingSize = parsedItems.find(cartItem => cartItem.size === item.size);
      console.log('===============matching color', matchingColor)
      console.log('===============matching size', matchingSize)
      console.log('===============existingItem ', existingItem)
      // if exist
      if (existingItem && matchingColor && matchingSize) {
        console.log('===============all 3 matchings are true', existingItem, matchingSize, matchingColor)

        // loop through parsedItems 
        const updateQuantity: CartItem[] = parsedItems.map(cartItem =>
          // const updateQuantity: Products[] = parsedItems.map(cartItem =>
          // if stored ID === new ID, then just update the quantity of the stored item.
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 }
            // else just return the data. 
            : cartItem,
        );





        // // ================== ON HOLD =============================
        // // Store updated data to LocalStorage
        localStorage.setItem('items', JSON.stringify(updateQuantity));
        // // set the state
        setCart(updateQuantity);
        // // ================== ON HOLD =============================

        // if not  exist
      } else {
        console.log('===============else existingItem  true', existingItem)
        console.log('===============else matchingSize true', matchingSize)
        console.log('===============else matchingColor true', matchingColor)

        // Push new data to existing array of shopping items.
        parsedItems.push(item);
        // Store to LocalStorage
        localStorage.setItem('items', JSON.stringify(parsedItems));
        // set the State
        setCart(parsedItems);

      }
    }

    // // ================== ON HOLD =============================
    // setCart(prevCart => {
    //   console.log('======= from cartContext prevCart', prevCart)
    //   console.log('======= updatedItems inside setCart', updatedItems);
    //   const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
    //   // console.log('======= from cartContext existingItem', existingItem)
    //   // useEffect(() => {

    //   // }, []);
    //   if (existingItem) {
    //     console.log('===========existingItem', existingItem);
    //     // console.log('===========item.id', item)
    //     // console.log('===========cartItem.id', prevCart[0].id)        
    //     return prevCart.map(cartItem =>
    //       cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 }
    //         : cartItem
    //     );
    //   } else {
    //     console.log('=========== none existingItem', existingItem)
    //     // console.log('=========== none existingItem item', item)
    //     // next up: couple of issues with this. 1. we are adding(updatedItems) incorrectly it come like this: updatedItems = [[[0], [1]]] it should be = [[0], [1]]. 2. if item excit then just + 1 the quantity
    //     // localStorage.setItem('items', JSON.stringify(item));
    //     return [...prevCart, { ...item, quantity: 1 }];
    //   }
    // });
    // // ================== ON HOLD =============================






  };
  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
// export const getServerSideProps: GetServerSideProps<Props> = async () => {
//   await dbConnect();
//   try {

//     const productsResult = await Product.find({}).populate("sizes").exec();
//     // To Populate mogoose model we HAVE TO populate it like below: populate({ path: 'sizes', model: Size }) otherwise won't work.
//     const productsResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
//     const stringifyAllProduct = JSON.parse(JSON.stringify(productsResult));
//       return { props: { allProductsONHOLD: stringifyAllProduct } };
//   } catch (err) {
//     return { props: { allProductsONHOLD: [] } };
//   }
// };
