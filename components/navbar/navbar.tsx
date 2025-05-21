import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from '../../state/CartContext';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

// interface NavBarProps {
//   onSearch: (query: string) => void;
// }

// handle navBar
const Navbar = () => {
  // get Cart instance 
  const { cart } = useCart();
  const [query, setQuery] = useState<string>('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  // Handle submit form.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hide keyboard by blurring the input for mobile devices. 
    if (inputRef.current) {
      inputRef.current.blur();
    }
    // trim(): removes whitespace from both ends of this string and returns a new string.
    if (query.trim()) {
      // Navigate to the search results page with the query as a URL parameter.     
      router.push(`/search?query=${decodeURIComponent(query.trim())}`);// decodeURIComponent(): to remove whitespace sign (%20) at the URL.     
      // Clear the input field by resetting the query state
      setQuery('');
    }
  };
  return (
    <>
      <div className="w-full p-3 flex  items-center justify-between border  ">
        <div className="  ">
          <Link href={'/'}>Home</Link>
        </div>
        <div className=" overflow-hidden  w-auto ">
          <form action="" className="" onSubmit={handleSearchSubmit}>
            <input type="text" className="w-40 h-8 rounded-md pl-2 inline border border-gray-400" maxLength={20} name="search" id="search" ref={inputRef} placeholder="Search Products" onChange={handleSearchInputChange} value={query} required />
            <button type="submit" className=" border border-gray-400 mt-0 inline w-12 ml-2 rounded-md h-8 text-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="4 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5  inline text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
              </svg>
            </button>
          </form>
        </div>
        <div className="  ">
          {cart.length ? (
            <div className="cart-container">
              <Link href={'/shoppingcart'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h15l-1.5 9h-13L6 6z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                <div className="cart-notification-badge">{cart.length}</div>
              </Link>
            </div>
          ) : (
            <div className="getCartClassname inline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6h15l-1.5 9h-13L6 6z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default Navbar;