import { createContext, useState, useEffect } from 'react';
import { GetServerSideProps } from "next";
import dbConnect from "../lib/dbConnect";
import Cart from "../components/shoppingCart/cart";

// handle shopping Cart
const shoppingcart = () => {
  return (
    <>
      < Cart />
    </>
  )
}

export default shoppingcart; 
