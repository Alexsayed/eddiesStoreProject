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
// next upp: so far we can login / out now for edit.tsx page we need to put condion so only admin can visit that page
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
  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // const cleanQuery = e.target.value.trim().replace(/\s+/g, '+');
    // setQuery(cleanQuery);
  };
  // Handle submit form.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="w-full h-20 p-3 flex items-center justify-between mx-auto border">
        <div className="inline">
          <Link href={'/'}>dropdown menu vp-550px</Link>
        </div>
        <div className="inline">Project Name</div>
        <div className="inline-flex items-center">
          <form action="" className="flex items-center" onSubmit={handleSearchSubmit}>
            <input type="text" className="w-40" maxLength={20} name="search" id="search" placeholder="Search" onChange={handleSearchInputChange} value={query} required />
            <button type="submit" className="border mt-0 inline ml-2"> Search</button>
          </form>
        </div>
        {status === 'authenticated' ? (
          <>
            <div className="inline">
              <button onClick={() => signOut()}>Sign Out</button>
            </div>
            <div className="inline"><Link href={'/new'}>Post New Product</Link></div>
          </>
        ) : (
          <div className="inline">
            <Link href={'/auth/signin'}>Sign In </Link>
          </div>
        )}
        {cart.length ? (
          <div className="inline">
            <Link href={'/shoppingcart'}>Cart: {cart.length}</Link>
          </div>
        ) : (
          <div className="getCartClassname h-12">Cart</div>
        )}
      </div>
    </>
  )
}
export default Navbar;