import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import ProductPage from '../home/product';
import Product, { Products } from "../../models/products";
import Link from "next/link";


// import { count } from "console";
// import { add } from '../home/product';
// import { add } from '../home/product';


import { useCart } from '../../state/CartContext';
import { link } from 'fs';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
// var someValue: number;
// export function add(a: number, b: number) {



//   // return a + b;
//   // setCount(a + b);
//   someValue = a + b;
//   console.log('===========someValue', someValue)

//   return someValue;
//   // return count;
// };


// export const useCounter = (initialValue = 0) => {
//   const [count, setCount] = useState(initialValue);
//   console.log('===========useCounter from nav',)

//   const increment = () => {
//     setCount(count + 1);
//   };

//   return { count, increment };
// };
// const someValue;

// const Navbar = ({ valueOfClick }: Props) => {
// var getname: string[] = [];

// export function greet(name1: string) {
//   const [count, setCount] = useState('');
//   console.log('===========name', name1)
//   useEffect(() => {
//     setCount(name1);
//   }, [name1]);
//   console.log('===========count', count)

//   // getname.push(name1)
//   // return `Hello00, ${name1}!`;
//   return count;
// }
interface NavBarProps {
  onSearch: (query: string) => void;
}
// next upp: so far we can login / out now for edit.tsx page we need to put condion so only admin can visit that page
const Navbar = () => {
  // const Navbar = ({ onSearch }: NavBarProps) => {
  // const Navbar: React.FC<NavBarProps> = ({ onSearch }) => {
  // const Navbar: React.FC = () => {
  const { cart } = useCart();
  const [data, setData] = useState(null);
  const contentType = "application/json";
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();


  // const [count, setCount] = useState('some text');
  // console.log('===========onSearch inside', onSearch)
  // console.log('===========session', session)
  // console.log('===========status', status)
  // console.log('===========sessionsession?.user?.role', session?.user?.role)
  // greet(getname)
  // console.log('===========cart navBar', cart)
  // const submitSearch = async (e: React.FormEvent<HTMLFormElement>) => {

  //   // useEffect(() => {
  //   const fetchData = async () => {
  //     // const response = await fetch('http://localhost:3000/api/pets');
  //     const response = await fetch('http://localhost:3000/api/products');
  //     console.log('=============response', response)

  //     const json = await response.json();
  //     console.log('=============json', json)

  //     // setListing(json.data);
  //   };

  //   fetchData();
  //   // }, []);
  //   console.log('===========submit', e)

  // }
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
  // Next up: when the  search submited the we should erase the < input > value for now the input value show any URL we redirect.
  return (
    <>
      <div className="w-full h-28 p-4 flex items-center justify-between mx-auto border">
        <div className="inline">
          <Link href={'/'}>menu</Link>
        </div>
        <div className="inline">Project Name</div>
        <div className="inline-flex items-center">
          <form action="" className="flex items-center" onSubmit={handleSearchSubmit}>
            <input type="text" className="w-40" maxLength={20} name="search" id="search" placeholder="Search" onChange={handleSearchInputChange} value={query} required />
            <button type="submit" className="border mt-0 inline ml-2"> Search</button>
          </form>
        </div>
        {session ? (
          <>
            <Link href="/profile">Profile</Link>
            {/* <p>{session.user}</p> */}
            {/* {session.user.role === 'admin' && <Link href="/admin/dashboard">Admin Dashboard</Link>} */}
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <div className="inline">
            <Link href={'/auth/signin'}>Sign In</Link>
          </div>
          // <Link href="/auth/signin">Sign In</Link>
        )}

        {cart.length ? (
          <div className="h-12">
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