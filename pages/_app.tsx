import React from 'react';
import "../css/style.css";
import "../css/form.css";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import Head from "next/head";
import Link from "next/link";
import type { AppProps } from "next/app";
import dbConnect from "../lib/dbConnect";
import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";
import MenuBar from "../components/menu/menu";
import HomePage from "../components/home/landingPage";
import User from "../models/Users";
import PostProduct from "../components/postProduct/postProduct";
import { CartProvider } from '../state/CartContext'
import Product, { Products } from "../models/products";
import Size, { ISizes } from '../models/sizes';
import { BsPen, BsTrash } from "react-icons/bs";
import Cart from "../components/shoppingCart/cart";
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;
// const stripePromise = loadStripe(stripePubKey as string);

// const stripePromise = loadStripe('pk_test_51R7dtDP7KMWoVOpUwgyMlk8vE2vhsAZURoWou00e99kZZxvlSbQ6KnQkmcQPW4yY3vdykw8Vx7y11JpwJLgiIRoz00DagqU5k9');


console.log('===== process.env.NEXT_PUBLIC_ADMIN_USERNAME', process.env.NEXT_PUBLIC_STRIPE_PUB_KEY);
// console.log('=======stripePromise', stripePromise)
// console.log('=====Footer', Footer);

// async function getData() {
//   const res = await fetch('http://localhost:3000/api/pets', {
//     cache: 'no-store'
//   });
//   return res.json()

// }


// next up: create components and call them here
function MyApp({ Component, pageProps }: AppProps) {
  // ***********************************Original **********************************

  // console.log('=====Product from App', pageProps);
  // const [stripeReady, setStripeReady] = useState(false);
  // const [stripe, setStripe] = useState<Stripe | null>(null);
  // useEffect(() => {
  //   // Load Stripe asynchronously
  //   const stripePromise = loadStripe(stripePubKey as string);

  //   stripePromise.then((stripeInstance) => {
  //     console.log('=====sstripeInstance', stripeInstance);
  //     console.log('=====stripePromise', stripePromise);

  //     setStripe(stripeInstance);
  //     setStripeReady(true);
  //   }).catch((error) => {
  //     console.error('Error loading Stripe:', error);
  //     setStripeReady(false);
  //   });
  // }, []);
  // // Optionally render a loading state if Stripe is not ready yet
  // if (!stripeReady) {
  //   return <div>Loading Stripe...</div>;
  // }
  // ***********************************Original **********************************
  // console.log('=====stripe app,js', stripe);
  // console.log('=====stripePromise app.js', stripePromise);

  // const router = useRouter();
  // console.log('=====Component from --app.tsx', Component)
  // console.log('=====pageProps  --app.tsx', pageProps)
  // console.log('=====AppProps  --app.tsx', AppProps.pageProps)

  // const [count, setCount] = useState('some text');
  // console.log('===========someValue inside', someValue)
  // console.log('===========count inside', count)

  // const updateCount = (newCount: any) => {
  //   console.log('===========newCount', newCount)

  //   setCount(newCount);
  // }

  // useEffect(() => {

  // const productsResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();

  // console.log('=====productsResult from app', productsResult);
  // }, []);
  // const data1 = getData();


  // ****************** Start here **************
  // const [Listing, setListing] = useState<Products[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('http://localhost:3000/api/pets');
  //     console.log('=============response', response)

  //     const json = await response.json();
  //     console.log('=============json', json)

  //     setListing(json.data);
  //   };

  //   fetchData();
  // }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('http://localhost:3000/api/products');
  //     // console.log('=============response', response)

  //     const json = await response.json();
  //     // console.log('=============json', json)

  //     setListing(json.data);
  //   };

  //   fetchData();
  // }, []);

  // console.log('=============Listing', Listing)
  // ****************** end here **************
  // next up: index.tsx is working but the problem is(navbar) no a good idea declaring navBar from index.tsx we need to fin d the way to send data to
  // < Component {...pageProps} /> the searchQuery
  // const hasRedirected = React.useRef(false);
  // let filteredResults: Products[] = [];
  // const [searchQuery, setSearchQuery] = useState<string>('');
  // const handleSearch = (query: string) => {
  //   console.log('=============Listing search', Listing)

  //   // console.log('=======handleSearch HIT ot zhope', query)
  //   setSearchQuery(query);

  // };
  // next up: create search.tsx so we can redirect to there
  // useEffect(() => {
  // if (searchQuery.length > 0 && !hasRedirected.current) {

  //   filteredResults = Listing.filter(item => item.productName.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

  //   // we use hasRedirected ref. to make sure the useEffect is NOT lopping infinitly.
  //   hasRedirected.current = true;
  //   console.log('========= if searchQuery app', searchQuery);
  //   console.log('========= if searchQuery app filteredResults', filteredResults);
  //   router.push('/shoppingcart');
  // } else {
  //   console.log('========= Else searchQuery app', searchQuery);

  // }
  // }, [searchQuery, router]);
  // console.log('=======handleSearch searchQuery ot zhope outside', searchQuery)
  // useEffect(() => {
  // if (searchQuery.length > 0) {
  //   filteredResults = Listing.filter(item => item.productName.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

  //   router.push('/shoppingcart');  // Redirect to /search if searchQuery is not empty
  // }


  // }, [searchQuery, router]);

  return (

    <>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>Pet Care App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        <CartProvider>

          <Navbar />
          <MenuBar menuData={''} />


          {/* <HomePage /> */}
          {/* <div className="top-bar">
          <div className="nav">
            <Link href="/">Homeeee</Link>
            <Link href="/new">Add Pet</Link>
          </div>

          <img
            id="title"
            src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
            alt="pet care logo"
          ></img>
        </div> */}
          {/* <div className="wrapper grid w-full"> */}
          <div className="wrapper  w-full">
            {/* <SessionProvider session={pageProps.session}> */}
            {/* <Elements stripe={stripe}> */}
            {/* <Elements stripe={stripePromise} > */}
            <Component {...pageProps} />
            {/* </Elements> */}
            {/* </SessionProvider> */}
            {/* <Component {...pageProps} /> */}
          </div>
        </CartProvider >

        <Footer />
      </SessionProvider>
    </>
  );


}
export default MyApp;
