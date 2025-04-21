import React from 'react';
import { useState, useEffect, useContext, useRef } from "react";

// import React, { createContext, useContext } from 'react';
// import React, { createContext, useContext, ReactNode } from 'react';

import { useRouter } from "next/router";
// import CartContext from '../navbar/navbar';
// import CartContext from './CartContext';
import { Products } from "../../models/products";
import Navbar from '../navbar/navbar';
// import { greet } from '../navbar/navbar';
import { useCart } from '../../state/CartContext';


// import Navbar from "../navbar/navbar";
// import { add } from "../navbar/navbar";
// interface CurrentUserContextType {
//   username: string;
// }
// interface ProductProps {
//   id: string;
//   productName: string | undefined;
//   price: number;
// }
// type bsProp = ProductProps;
type Props = {
  editFormId: string;
  productData: Products;
  // bsProp: ProductProps
  // updateText: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // updateText: React.MouseEventHandler<HTMLButtonElement>
  // updateText: (event: React.MouseEvent<HTMLElement>) => void
  // updateText: any
  // data: any
};

// interface Props {
//   editFormId: string;
//   productData: Products;
//   updateText: (e: Event) => void;
// }

// export function add(initialValue = 0) {
//   // export function add(e: React.MouseEvent<HTMLButtonElement>, id: string) {
//   // export function add(e: React.MouseEvent<HTMLButtonElement>, id: any) {

//   //   // return a + b;
//   //   const a = 5;
//   //   const b = 3;
//   //   console.log(a + b);
//   //   console.log(e);
//   // }
//   // export function add(id: string) {
//   // const a = 5;
//   // const b = 3;
//   // console.log(a + b);  // Sum of numbers
//   // console.log('a', a);     // The ID value (productData._id)
//   // console.log('e', e);     // The ID value (productData._id)
//   const [count, setCount] = useState(initialValue);
//   const increment = () => {
//     setCount(count + 1);
//   };
//   console.log('====increment', increment);  // Sum of numbers
//   console.log('=======count', count);  // Sum of numbers

//   // const counter = 0;

//   // counter++
//   // return 5;
//   return { count, increment };
// }
// const SomeComponent = () => {
//   return <div>{greet('World')}</div>;
// }

const totalQuantity = [10];
const quantityItems = totalQuantity[0];
const numbers = Array.from({ length: quantityItems }, (_, index) => index + 1);
// ******************************original **********************************
const ProductPage = ({ editFormId, productData, }: Props,) => {
  // const ProductPage: React.FC<ProductProps> = ({ editFormId, productData, }: Props,) => {
  // console.log('===========productData', productData);
  const selectColor = useRef<HTMLSelectElement>(null);
  const [productColor, setColor] = useState<string>('');
  // If you want getSize to hold an object of categories with their sizes. Example: Jackets:['S', 'M', 'L', 'XL']
  // const [getSize, setSize] = useState<{ [key: string]: string[] }>({});
  // If you want getSize to be a flat array of sizes (i.e., no categories): Example: ['S', 'M', 'L', 'XL']
  const [productSize, setSizes] = useState<string[]>([]);

  const [cartProductSize, setCartProductSize] = useState<string>('')
  const [cartProductquantity, setCartProductquantity] = useState<any>();

  console.log('============productData product ', productData.gender);
  console.log('============productData product ', productData.gender);
  useEffect(() => {
    // const trueCategories: { [key: string]: string[] } = {};
    // Array to collect all true sizes
    const trueCategories: string[] = [];
    if (productData.gender === 'Women') {
      console.log('======women gender')

      // Loop through each women category sizes 
      for (let [category, sizes] of Object.entries(productData.sizes.womenSizes)) {
        // Filter the sizes object to check for `true` values
        const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
        // If any size is true, add to the result
        if (trueSizes.length > 0) {
          // if we want to return only sizes WITH it's Category
          // trueCategories[category] = trueSizes.map(([size]) => size);
          // if we want to return only sizes BUT NOT it's Category
          trueCategories.push(...trueSizes.map(([size]) => size));
          console.log('=========trueCategories women', trueCategories)
        }
      }
      setSizes(trueCategories)
    } else {
      console.log('======men gender')
      // Loop through each men category sizes 
      for (let [category, sizes] of Object.entries(productData.sizes.menSizes)) {
        // Filter the sizes object to check for `true` values
        const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
        // If any size is true, add to the result
        if (trueSizes.length > 0) {
          // trueCategories[category] = trueSizes.map(([size]) => size);
          trueCategories.push(...trueSizes.map(([size]) => size));
          console.log('=========trueCategories men', trueCategories)
          console.log('=========productSize men', productSize)
          // setSizes([...trueSizes.map(([size]) => size)]);

        }
      }
      // ==========original ==============
      setSizes(trueCategories);
      // ==========original ==============
    }

  }, [productData]);
  // }, []);
  console.log('=========productSize men after', productSize)
  console.log('=========cartProductquantity ', cartProductquantity)




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
    let getValues = e.target.value;
    let getTargetName = e.target.name


    // set states for color and size when user selecting 
    switch (getTargetName) {
      // set color
      case 'color':
        console.log('=========color case', getValues)

        // setting Cart item color.
        // How it Works: we make sure we select one color per order, So if the added value (productColor) is equal to e.target.value then we empty the setColor state 
        setColor(e.target.value === productColor ? '' : e.target.value);
        // setColor(oneColor);
        break;
      // set Size
      case 'Sizes':
        console.log('=========size case', getValues)
        setCartProductSize(getValues);
        break;
      case 'quantity':
        console.log('=========quantity case', typeof getValues)
        setCartProductquantity(getValues)
        break;
      default:
        console.log('=========default case ')

        alert('You must select size and color')
        break;
    }
  }
  // next up: let the user to select quantity of the element
  const { addToCart } = useCart();
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission
    // validate if no color is selected 
    if (!productColor) {
      alert('Please select a color.');
      return;
    }
    // validate if no size is selected
    if (!cartProductSize) {
      alert('Please choose a size.');
      return;
    }
    const item = {
      id: productData._id,
      productName: productData.productName,
      price: productData.price,
      productImg: productData.productImg,
      category: productData.category,
      brand: productData.brand,
      gender: productData.gender,
      color: productColor,
      size: cartProductSize,
      quantity: 1
    };
    // add to cart above item.
    addToCart(item);
  };
  // next up: setup the < input > elements for size and color so user can pick the option
  if (typeof window !== 'undefined' && window.localStorage) {
    const getStorage = localStorage.getItem('items');
    // localStorage.removeItem("items");
    // console.log('===== items  LoaclStorge from Product.tsx', JSON.parse(getStorage))
  }

  // useEffect(() => {
  // const items = JSON.parse(localStorage.getItem('items'));
  // if (items) {
  //   //  setItems(items);
  //   console.log('===== items from LoaclStorge', items)
  // }
  // }, []);
  // const [count, setCount] = useState('some text');

  // const currentUser = useContext(CurrentUserContext);
  // ******************************original **********************************
  // console.log('=======Navbar', Navbar)
  // console.log('=======useCounter', useCounter)
  // Navbar.useCounter();
  // export const productPage = ({ editFormId, productData }: Props) => {

  // const { addToCart } = useContext(CartContext);
  // const [cartValue, setCartValue] = useState(''); 

  // const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   console.log('ahndelClick', event)
  // updateText(event)
  // setCount(newCount);
  // next up: i need to find out how to count++ everytime a button is click
  // const increment = () => {
  //   setCount(count + 1);
  // };
  // // =========================== working ======================================
  // setCount(count + 1);
  // console.log('=======count', count)
  // var editDeleteContainer = document.getElementsByClassName('getCartClassname');
  // console.log('=======editDeleteContainer', editDeleteContainer)
  // editDeleteContainer[0].innerText = count;
  // // =========================== working ======================================


  // console.log('=======onClick product', message)

  // now that we can change cart count, next up is to add ids to localStorge
  // };
  // const [count, setCount] = useState('some text');

  // start from ground zero: click > setLocalStrage > pickup data somewhere else
  // const updateCount = (newCount: any) => {
  //   console.log('===========newCount', newCount)

  //   setCount(newCount);
  // }
  // const [message, setMessage] = useState('Hello, world!');
  // 
  // const handleNarbarClick = () => {
  //   setCount('You clicked the Navbar button!');
  //   console.log('==============handleClick if fired')

  // };


  // console.log('=======addToCart  cartItems', cartItems)

  // fuck this shit man.find a way to update Cart icon when a button is clicked
  return (

    <>
      {/* <div>{greet('World')}</div> */}
      {/* <Navbar updateText={updateCount} /> */}
      <div id={editFormId} className="w-full">
        <div className="inline-block w-20 align-top  ml-2.5 text-center">
          <ul>
            <li className="h-16 w-16  border mb-1 rounded-sm"><img src={productData.productImg} alt="" /></li>
            <li className="h-16 w-16 border mb-1 rounded-sm"><img src={productData.productImg} alt="" /></li>
            <li className="h-16 w-16 border mb-1 rounded-sm"><img src={productData.productImg} alt="" /></li>
            <li className="h-16 w-16 border mb-1 rounded-sm"><img src={productData.productImg} alt="" /></li>
            <li className="h-16 w-16 border mb-1 rounded-sm"><img src={productData.productImg} alt="" /></li>
          </ul>
        </div>
        <div className="w-1/2 ml-2.5 inline-block">
          <img className="h-96 w-full" src={productData.productImg} alt="" />
        </div>
        <div className="inline-block h-96 align-top ml-2.5 border w-1/3 text-center">
          <p>{productData.brand} {productData.productName}</p>
          <p>{productData.price}</p>
          <p>Color:{productData.color}</p>

          {/* <p> */}


          <ul>
            {/* {Object.entries(productData.sizes.womenSizes.sweaters).map(([size, flag]) => (
              <li key={size}>{`${size}: ${flag ? 'True' : 'False'}`} {size}: {flag.toString()}</li>
            ))} */}
          </ul>
          {/* {productData.sizes.womenSizes.sweaters.XS.toString()}Sssize */}
          {/* </p> */}
          <p>{!productData}</p>
          {/* <p>Size: {productData.sizes.menSizes.sweaters.XS.toString()}</p> */}
          {/* <p>Size: {productData.sizes.menSizes.sweaters.L.toString()}</p> */}
          <p>inStock: {productData.inStock}</p>
          {/* <button onClick={ }>Click Me please</button> */}
          <label htmlFor="Color">Color</label>
          {/* <select name="Color" className="border rounded-lg" onChange={handleChange} required  >
            <option value="" >choose color</option>
            {productData.color.map((color, index) =>
              <option key={index} value={color}>{color}</option>
            )}
          </select> */}
          {productData.color.map((color, index) =>
            <label key={index} className="checkbox-container">
              <input type="checkbox" name='color' value={color} checked={productColor === color} onChange={handleChange} required />
              <span className="checkbox" style={{ border: `3px solid ${color}` }}></span>
            </label>
          )}

          <label htmlFor="Sizes">Sizes</label>
          <select name="Sizes" className="border rounded-lg" onChange={handleChange} required  >
            <option value="" >choose a size</option>
            {productSize.map((size, index) =>
              <option key={index} value={size}>{size}</option>
            )}
          </select>
          <div>
            <label htmlFor="quantity" >quantity</label>
            <select name="quantity" className="border rounded-lg " onChange={handleChange} required  >
              <option value="" >choose quantity</option>
              {numbers.map((amount, index) =>
                <option key={index} value={amount}>{amount}</option>
              )}
            </select>
          </div>
          <button className="rounded-sm border bg-green-400" onClick={handleAddToCart}>Add to Cart</button>

          {/* <p>add: {add(1, 3)}</p> */}
          {/* <button onClick={() => add(1, 3)}>Click Me</button> */}
          {/* <button onClick={() => add(1, 3)}>Click Me</button> */}
          {/* <button onClick={(f) => add(f, productData._id)}>Click Me</button> */}
          {/* <button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => add(e, productData._id)}>Click Me</button> */}
          {/* <p>Name: {data.name}</p>
          <p>Age: {data.age}</p> */}

          {/* <button className="rounded-sm border bg-green-400" onClick={() => greet('World')}>Add to Cart</button> */}


        </div>

      </div >

    </>
  )

}
export default ProductPage;
// export default CartContext;
