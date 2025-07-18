import React from 'react';
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { Products } from "../../models/products";
import Navbar from '../navbar/navbar';
import { useCart } from '../../state/CartContext';

type Props = {
  productData: Products;
};

const ProductPage = ({ productData, }: Props,) => {
  const [productColor, setColor] = useState<string>('');
  const [productQuantity, setQuantity] = useState<number>(0);
  // If you want getSize to hold an object of categories with their sizes. Example: Jackets:['S', 'M', 'L', 'XL']
  // const [getSize, setSize] = useState<{ [key: string]: string[] }>({});
  // If you want getSize to be a flat array of sizes (i.e., no categories): Example: ['S', 'M', 'L', 'XL']
  const [productSize, setSizes] = useState<string[]>([]);
  const [cartProductSize, setCartProductSize] = useState<string>('')
  const [cartProductQuantity, setCartProductQuantity] = useState<number>(0);
  // Previewing product images. By default the first image will be selected.
  const [imagePreview, setImagePreview] = useState<string>(productData.productImg[0].imageURL || '');
  const imageRef = useRef<HTMLImageElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  // The Array.from() static method creates a new, shallow-copied Array instance.
  // Example: productQuantity = 4; Array.from() would create  [1,2,3,4], so we can loop through it.
  const quantity = Array.from({ length: productQuantity }, (unused, index) => index + 1);
  const { addToCart } = useCart();

  // handling women and men corresponding product sizes 
  useEffect(() => {
    // const trueCategories: { [key: string]: string[] } = {};
    // Array to collect all true sizes
    const trueCategories: string[] = [];
    if (productData.gender === 'Women') {
      // Loop through each women category sizes 
      for (let [category, sizes] of Object.entries(productData.sizes.womenSizes)) {
        // Filter the sizes object to check for `true` values
        const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
        // If any size is true, push to trueCategories array.
        if (trueSizes.length > 0) {
          // if we want to return only sizes WITH it's Category
          // trueCategories[category] = trueSizes.map(([size]) => size);
          // if we want to return only sizes BUT NOT it's Category
          trueCategories.push(...trueSizes.map(([size]) => size));
        }
      }
      setSizes(trueCategories)
    } else {
      // Loop through each men category sizes 
      for (let [category, sizes] of Object.entries(productData.sizes.menSizes)) {
        // Filter the sizes object to check for `true` values
        const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
        // If any size is true, add to the result
        if (trueSizes.length > 0) {
          // trueCategories[category] = trueSizes.map(([size]) => size);
          trueCategories.push(...trueSizes.map(([size]) => size));
          // setSizes([...trueSizes.map(([size]) => size)]);
        }
      }
      setSizes(trueCategories);
    }

  }, [productData]);

  // Handle matching height of Preview image and the side array of images.
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640 && imageRef.current && thumbRef.current) {
        // getting the height of imagePreview/main image
        const height = imageRef.current.offsetHeight;
        // set the height of side images to height of imagePreview/main image.
        thumbRef.current.style.height = `${height}px`;
      } else if (thumbRef.current) {
        thumbRef.current.style.height = ''; // Reset on larger screens
      }
    };
    updateHeight();
    // update on window resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [imagePreview]);

  // handle setting Cart values. Color, size and quantity.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
    let getValues = e.target.value;
    let getTargetName = e.target.name
    // set states for color, size and quantity, when user selecting     
    switch (getTargetName) {
      // setting Cart item color. Can select one color per order.
      case 'color':
        // when a color is selected we would search for match color in (productData.colors)
        const selectedColorObj = productData.colors.find(
          (elem) => elem.color === getValues
        );
        // Initially productColor = ''; so when a use selects a color we would store the selected value to (productColor)
        // If the bottom statement is equal/true that means the user deselects the early selected color.  
        // NOTE: user is allowed to select one color per order.
        if (getValues === productColor) {
          // Deselect color if user clicks the same one again          
          setColor('');
          setQuantity(0);
        } else {
          // Set selected color and corresponding quantity
          setColor(getValues);
          // if selected color exist in (productData.colors) then we would get it's quantity.
          if (selectedColorObj) {
            setQuantity(selectedColorObj.quantity);
          }
        }
        break;
      // set Size
      case 'sizes':
        setCartProductSize(getValues);
        break;
      // set quantity
      case 'quantity':
        setCartProductQuantity(Number(getValues))
        break;
      default:
        alert('You must select size and color')
        break;
    }
  };

  // Handle 
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
    // Define Cart item structure 
    const item = {
      id: productData._id,
      productName: productData.productName,
      price: productData.price,
      productImg: productData.productImg[0].imageURL || '',
      category: productData.category,
      brand: productData.brand,
      gender: productData.gender,
      colors: productColor,
      size: cartProductSize,
      quantity: cartProductQuantity === 0 ? 1 : cartProductQuantity,
      inStock: productData.inStock,

    };
    // add to cart above item.
    addToCart(item);
  };

  // Handle preview product images.
  const previewImage = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    // get clicked image.src
    const clickedImage = img.currentSrc;
    if (!clickedImage) return;
    if (imagePreview === clickedImage) return;
    // Toggle between product images.
    setImagePreview(prev =>
      prev === clickedImage ? productData.productImg[0].imageURL : clickedImage
    );
  }

  return (
    <>
      <div className="w-full mt-9 md:mt-0 border-t pt-2 flex flex-wrap   ">
        <div ref={thumbRef} className=" w-[20%] sm:w-[13.5%] px-1.5 sm:px-3  order-1  rounded text-center overflow-x-scroll  sm:overflow-auto max-h-[450px] " >
          <ul className=' '>
            {productData.productImg.map((image, index) =>
              <li className="mb-1" key={index}>
                <div className="w-full aspect-[1/1] flex items-center justify-center cursor-pointer">
                  <img onClick={previewImage} className=" h-full w-full object-cover rounded" src={image.imageURL} alt="" />
                </div>
              </li>
            )}
            <li className="mb-1" >
              <div className="w-full aspect-[1/1] flex items-center justify-center cursor-pointer">
                <img onClick={previewImage} className=" h-full w-full object-cover rounded" src="https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2" alt="" />
              </div>
            </li>
            <li className="mb-1" >
              <div className="w-full aspect-[1/1] flex items-center justify-center cursor-pointer">
                <img onClick={previewImage} className=" h-full w-full object-cover rounded" src="https://www.ohpolly.com/cdn/shop/files/6172_8_Sloane-Black-Thigh-Split-MaxiDress.jpg?v=1683187303&width=920" alt="" />
              </div>
            </li>
            <li className="mb-1" >
              <div className="w-full aspect-[1/1] flex items-center justify-center cursor-pointer">
                <img onClick={previewImage} className=" h-full w-full object-cover rounded" src="https://us.ohpolly.com/cdn/shop/products/5891_3_Teal-Cut-Out-Maxi-Dress_39687738-3e71-4760-8d26-2a6d283048c3.jpg?v=1689364855&width=1244" alt="" />
              </div>
            </li>

          </ul>
        </div>
        <div className="w-[75%] sm:w-[62.5%]  mx-auto   overflow-hidden  order-2 rounded max-h-[450px]" >
          <img ref={imageRef} className="w-full h-auto sm:h-full object-contain  rounded  " src={imagePreview} alt="" />
        </div>
        <div className="w-full sm:w-[20%]  order-3 sm:order-3 rounded px-3 mt-3 sm:mt-0">
          <h1 className='text-xl  '>{productData.brand} {productData.productName}</h1>
          {productData.inStock ? (
            <p className='text-green-500 text-sm mb-3'>In Stock</p>
          ) : (
            <p className='text-red-500 text-sm mb-3'>Out of Stock</p>
          )}
          <p className='text-xl mb-1 '>${productData.price}.00</p>
          <hr />
          <div className='w-11/12'>
            <label htmlFor="Color" className='mt-'>Color:</label>
            {productData.colors.map((elem, index) =>
              <label key={index} className="checkbox-container mt-0">
                <input type="checkbox" name='color' value={elem.color} checked={productColor === elem.color} onChange={handleChange} required />
                <span className="checkbox" style={{ border: `3px solid ${elem.color}` }}></span>
              </label>
            )}
          </div>
          {productQuantity > 0 && (
            <div className=''>
              <label htmlFor="quantity" className=''>quantity:</label>
              <select name="quantity" id='quantity' className="border rounded-lg bg-white pl-1.5 w-11/12" onChange={handleChange} required  >
                {quantity.map((elem, index) =>
                  <option key={index} value={elem}>{elem}</option>
                )}
              </select>

            </div>
          )}
          <div>
            <label htmlFor="sizes" className=''>Sizes:</label>
            <select name="sizes" id='sizes' className="border rounded-lg w-11/12 bg-white pl-1.5" onChange={handleChange} required  >
              <option value="" >Size</option>
              {productSize.map((size, index) =>
                <option key={index} value={size}>{size}</option>
              )}
            </select>
          </div>
          <button className="rounded-lg w-24 h-8 border bg-black text-white mt-4" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div >
    </>
  )
}
export default ProductPage;

