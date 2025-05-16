import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from '../../state/CartContext';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

interface NavBarProps {
  onSearch: (query: string) => void;
}

// handle navBar
const Navbar = () => {
  // const Navbar = ({ onSearch }: NavBarProps) => {
  // const Navbar: React.FC<NavBarProps> = ({ onSearch }) => {
  // const Navbar: React.FC = () => {
  const { cart } = useCart();
  // const [data, setData] = useState(null);
  // const contentType = "application/json";
  const [query, setQuery] = useState<string>('');
  // const [results, setResults] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // const cleanQuery = e.target.value.trim().replace(/\s+/g, '+');
    // setQuery(cleanQuery);
  };
  // search does not working on smartphones
  // Handle submit form.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hide keyboard by blurring the input for mobile devices. 
    if (inputRef.current) {
      inputRef.current.blur();
    }
    // trim(): removes whitespace from both ends of this string and returns a new string.
    if (query.trim()) {
      //   // Navigate to the search results page with the query as a URL parameter.     
      router.push(`/search?query=${decodeURIComponent(query.trim())}`);// decodeURIComponent(): to remove whitespace sign (%20) at the URL.     
      //   router.push('/search?query=skirt')
      //   // Clear the input field by resetting the query state
      setQuery('');
    }
  };
  return (
    <>
      <div className="w-full p-3 flex flex-wrap items-center justify-between border gap-2 ">
        {/* <div className="w-full p-3 flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between border gap-2"> */}


        <div className="order-1  ">
          <Link href={'/'}>Home</Link>
        </div>
        {/* <div className="w-full  order-4 md:order-2 md:w-auto"> */}
        {/* <div className=" w-full order-4 md:order-2  md:w-auto border "> */}
        <div className=" order-4 w-full overflow-hidden  md:order-2  md:w-auto sm:w-full sm:ml-0      mt-auto ml-auto flex justify-end border">
          {/* <form action="" className="flex w-full items-center " onSubmit={handleSearchSubmit}> */}
          <form action="" className="flex float-right" onSubmit={handleSearchSubmit}>
            {/* <input type="text" className="w-full md:w-32 lg:w-56 h-8 rounded-md pl-2" maxLength={20} name="search" id="search" ref={inputRef} placeholder="Search Products" onChange={handleSearchInputChange} value={query} required /> */}
            <input type="text" className="w-56 h-8 rounded-md pl-2" maxLength={20} name="search" id="search" ref={inputRef} placeholder="Search Products" onChange={handleSearchInputChange} value={query} required />
            <button type="submit" className="border mt-0 inline ml-2 rounded-md h-8"> Search</button>
          </form>
        </div>
        <div className="order-2 md:order-3 ">
          {status === 'authenticated' ? (
            <>
              <button onClick={() => signOut()}>Sign Out</button>
              <Link href={'/new'} className="ml-2">
                Post New Product
              </Link>
            </>
          ) : (
            <Link href={'/auth/signin'}>Sign In</Link>
          )}
        </div>
        <div className="order-3 md:order-4  ">
          {cart.length ? (
            <div className="cart-container">
              <Link href={'/shoppingcart'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h15l-1.5 9h-13L6 6z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                <div className="cart-notification-badge">{cart.length}</div>
              </Link>
            </div>
          ) : (
            <div className="getCartClassname inline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
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