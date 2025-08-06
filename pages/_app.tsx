import React from 'react';
import "../css/style.css";
import "../css/form.css";
import "../css/navBar.css";
import "../css/icons.css";
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


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>

      <SessionProvider session={pageProps.session}> {/* SessionProvider: is spreading authentication throuhout all pages  */}
        <Head>
          <title>Store Product App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        <CartProvider> {/* spreading addToCart function throughout components */}
          <Navbar />
          <MenuBar menuData={''} />
          <div className="wrapper  w-full ">
            <Component {...pageProps} />
          </div>
        </CartProvider >
        <Footer />
      </SessionProvider>
    </>
  );
}
export default MyApp;
