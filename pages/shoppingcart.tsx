import { createContext, useState, useEffect } from 'react';
import { GetServerSideProps } from "next";
import dbConnect from "../lib/dbConnect";
import Cart from "../components/shoppingCart/cart";




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
  cartItems: CartItem[]
  // sizes:
  // products1: String;

};

const shoppingcart = ({ cartItems }: Props) => {
  // const shoppingcart = () => {


  // const strigstringifyBS = JSON.stringify(bs);
  // console.log('=========strigstringifyBS', strigstringifyBS)

  // const parseStringifyBS = JSON.parse(JSON.stringify(bs));
  // console.log('=========parseStringifyBS', parseStringifyBS)
  // let parsedCartItems1: any = [];
  // useEffect(() => {
  // if (typeof window !== 'undefined' && window.localStorage) {
  //   const getStorage: string | null = localStorage.getItem('items');
  //   console.log('=========getStorage', getStorage)
  //   if (getStorage !== null) {
  //     try {
  //       // const stringifyCartItems = JSON.stringify(getStorage);
  //       // console.log('=========stringifyCartItems', stringifyCartItems);
  //       parsedCartItems1 = JSON.parse(getStorage);
  //       console.log('=========parsedCartItems', parsedCartItems1)
  //       // var parsedCartItems1 = JSON.parse(stringifyCartItems);

  //       // const parsedCartItems = JSON.parse(JSON.stringify(getStorage));

  //       //   const parseStringifyBS = JSON.parse(JSON.stringify(bs));
  //       //   //       console.log('===== parsedCartItems', parsedCartItems)
  //       //   // return { props: { cartItems: 'ahahah' } };
  //       //   // setStoredItems(parsedCartItems);


  //     } catch (error) {
  //       console.error('Error parsing stored items from localStorage', error);
  //     }

  //     //   // } else {
  //     //   //   console.log('No items found in localStorage');
  //   }


  // }
  // }, []);


  return (
    <>
      {/* < Cart getCartItems={cartItems} /> */}
      {/* < Cart getCartItems={cartItems} /> */}
      < Cart />
    </>
  )

}

export default shoppingcart; 
