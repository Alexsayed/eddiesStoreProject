import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface CartItem { // Products interface
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

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void; // extending addToCart function interface to all pages
  setCart: (items: any[]) => void;
}
interface CartProviderProps {
  children: ReactNode;
}
// Creating Cart context
const CartContext = createContext<CartContextType | undefined>(undefined);
// Extend cart, addToCart and setCart to all page.
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
// Extend CartProvider to _App.tsx
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedItems = localStorage.getItem('items'); // Get items from localStorage
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems); // Convert JavaScript value or object 
          setCart(parsedItems);
        }
      } catch (error) {
        console.error('Failed to load items from localStorage:', error);
      }
    }
  }, []);
  // Handle Adding items to Shopping cart.
  const addToCart = (item: CartItem) => {
    // Get data from localStorage
    let currentItems: string | null = localStorage.getItem('items');
    // if there is no data in the localStorage, then add data to localStorage and setCart.
    if (currentItems === null || undefined) {
      localStorage.setItem('items', JSON.stringify([item]));
      // set the state so we can see the update in the navBar.tsx at shopping cart section.
      setCart([item]);
    } else {
      // localStorage is storing data as String, so below we need to return it to an Obj. 
      let parsedItems: CartItem[] = currentItems ? JSON.parse(currentItems) : [];
      // find an item with matching ID, color and size     
      const existingItemAll = parsedItems.find(cartItem => cartItem.id === item.id && cartItem.colors === item.colors && cartItem.size === item.size);

      // if (existingItem && matchingColor && matchingSize) { // if exist
      if (existingItemAll) { // if exist                
        // loop through parsedItems 
        const updateQuantity: CartItem[] = parsedItems.map(cartItem =>
          // if stored item ID, color and size are equal to new item, then just update the quantity of the stored item.
          cartItem.id === item.id && cartItem.colors === item.colors && cartItem.size === item.size
            // taking shalow copy of the stored item and updating it's quantity
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            // else just return the data. 
            : cartItem,
        );
        // Store updated data to LocalStorage
        localStorage.setItem('items', JSON.stringify(updateQuantity));
        // set the state
        setCart(updateQuantity);
      } else {  // if it does not  exist         
        parsedItems.push(item); // Push new data to existing array of shopping items.        
        localStorage.setItem('items', JSON.stringify(parsedItems)); // Store the pushed data to LocalStorage        
        setCart(parsedItems); // set the State        
      }
    }
  };
  // finaly return CartContext
  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
