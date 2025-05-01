import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';

import { mutate } from "swr";
import product, { Products } from "../../models/products";
// import { Products } from "../../models/products";
import Size, { ISizes } from "../../models/sizes";
import { arrayBuffer } from "stream/consumers";
// import Product from "../../models/products";
// // ******************************************************ORIGINAL ******************************************************             
// interface FormData {
//   productName: string;
//   price: string;
//   productImg: string;
//   author: string,
//   inStock: boolean;
//   created: Date;

// }
// type Props = {
//   formId: string;
//   productForm: FormData;
//   forNewProduct?: boolean;
// };
// const Form = ({ formId, productForm, forNewProduct = true }: Props) => {
//   const router = useRouter();
//   const contentType = "application/json";
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   console.log('===========router', router)
//   // console.log('===========id', id)
//   // console.log('===========router.query', router.query)
//   const [newProductForm, setForm] = useState({
//     productName: productForm.productName,
//     price: productForm.price,
//     productImg: productForm.productImg,
//     author: productForm.author,
//     inStock: productForm.inStock,
//     created: productForm.created,
//   });

// /* The POST method adds a new entry in the mongodb database. */
// const postProduct = async (newProductForm: FormData) => {
//   try {
//     // **********************ORIGINAL *******************
//     const res = await fetch("/api/pets", {
//       method: "POST",
//       headers: {
//         Accept: contentType,
//         "Content-Type": contentType,
//       },
//       body: JSON.stringify(newProductForm),

//     });
//     // console.log('==== newProductForm', newProductForm)
//     console.log('==== res from postProduct', res)
//     // Throw error with status code in case Fetch API req failed
//     if (!res.ok) {
//       throw new Error(res.status.toString());
//     }

//     router.push("/");
//   } catch (error) {
//     setMessage("Failed to add pet");
//   }
// };
// const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
//   const target = e.target;
//   const value = target.name === "inStock"
//     ? (target as HTMLInputElement).checked
//     : target.value;
//   const name = target.name;

//   setForm({ ...newProductForm, [name]: value, });
// };
// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   // const errs = formValidate();

//   // if (Object.keys(errs).length === 0) {
//   //   forNewPet ? postData(form) : putData(form);
//   // } else {
//   //   setErrors({ errs });
//   // }
//   console.log('======submit fired top ')
//   if (forNewProduct === true) {
//     console.log('======submit fired IF')
//     postProduct(newProductForm)
//   }
// };
// // ******************************************************ORIGINAL ****************************************************** 
// interface Products {
//   productName: string;
//   price: string;
//   productImg: string;
//   author: string,
//   inStock: boolean;
//   created: Date;

// }
// interface Products {
//   // id: string;
//   productName: string;
//   price: number;
//   productImg: string;
//   category: string;
//   brand: string;
//   gender: string[];
//   color: string;
//   size: string;
//   author: string,
//   inStock: boolean;
//   created: Date;
//   // quantity: number;
// }
type ColorItem = {
  color: string;
  index: number;
};
type QuantityItem = {
  quantity: number;
  index: number;
};
type Props = {
  formId: string;
  // product: Products;
  forNewProduct?: boolean;
};

// type ColorEntry = {
//   color: string;
//   quantity?: number;
//   // quantity?: string;
// };

interface ColorArray {
  // colorsData: any[]; // or specify the exact type you expect
  // colorsData: ColorEntry[]; // or specify the exact type you expect
  colorElements: JSX.Element[]; // Specifically an array of JSX elements (the input buttons)
}
// Extending variables to all files.
export const globalMenCategories = ['Jackets', 'Jeans', 'Pants', 'Shoes', 'Sweaters', 'Tees'];
export const globalWomenCategories = ['Dresses', 'Jackets', 'Jeans', 'Pants', 'Shoes', 'Skirts', 'Sweaters', 'Tops',];

// Declaring variable here so it won't reset to zero everytime we make changes in the page.
let storeColors: string[] = [];

// next up: we need to set color as array so there will be multi color array of < options > and admin selecting one or many
// Handle Post product.
// const Form = ({ formId, product, forNewProduct = true, }: Props) => {
const Form = ({ formId, forNewProduct = true, }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  // const [newProduct, setForm] = useState<any>([]);
  const [newProduct, setForm] = useState<Products[]>([]);
  const menSizes = useRef<HTMLDivElement>(null);
  const womenSizes = useRef<HTMLDivElement>(null);
  const categories = useRef<HTMLSelectElement>(null);
  const menCategories = ['Jackets', 'Jeans', 'Pants', 'Shoes', 'Sweaters', 'Tees'];
  const WomenCategories = ['Dresses', 'Jackets', 'Jeans', 'Pants', 'Shoes', 'Skirts', 'Sweaters', 'Tops',];
  const menShoeSizes = ['8', '9', '9_5', '10', '10_5', '11', '12'];
  const womenShoeSizes = ['6', '7', '8', '9', '10'];
  const menNumericSizes = ['28', '30', '32', '34', '36', '38']
  const womenNumericSizes = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34',];
  const productColors = ['White', 'Black', 'Yellow', 'yellowgreen', 'Red', 'orangered', 'Orange', 'Violet', 'blueviolet', 'Blue', 'Blue Green', 'Green',]
  // We asign all Alpha size in one array and then use it based on (Switch Cases)
  const alphaSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  // Women and Men category states
  const [menCategoryItems, setMenItems] = useState<any>([]);
  const [womenCategoryItems, setWomenItems] = useState<any>([]);
  // Show/hide the size element 
  const [isHidden, setIsHidden] = useState(true);
  // Men and Women sizes state.
  const [sizeItemsForAll, setSizeItemsForAll] = useState<any>({
    // Men sizes states
    menJackets: [],
    menJeans: [],
    menPants: [],
    menShoes: [],
    menSweaters: [],
    menTees: [],
    // Women sizes states
    womenDresses: [],
    womenJackets: [],
    womenJeans: [],
    womenPants: [],
    womenShoes: [],
    womenSkirts: [],
    womenSweaters: [],
    womenTops: [],
  });
  // next up: set up quantity for the product AND find a way to limit the number of item can be add at the < input > and it should not go over 999, for it accepts 999 but visually we can place as many number as we can
  // const [quantity, setQuantity] = useState<number>(Number);
  // const [newQuantity, setNewQuantity] = useState([{ quantity: Number, index: Number }]);
  const [newQuantity, setNewQuantity] = useState<QuantityItem[]>([]);
  // const [newColor, setNewColor] = useState([{ color: String, index: Number }]);
  const [newColor, setNewColor] = useState<ColorItem[]>([]); // Start with an empty array
  // console.log('=========quantity  top', quantity)

  const [colorArray, setColorArray] = useState<ColorArray>({
    // colorsData: [],
    colorElements: [],
  });
  // Handle setting the sizes
  const sizeElements = (arg: string[]) => {
    return arg.map((elem, i) => {
      return (
        < div key={i} className="inline-block w-20 ">
          <label htmlFor={elem} className="inline-block">{elem}</label>
          <input type="checkbox" name={elem} className="inline-block w-10 ahahha" onChange={handleChange} />
        </div>
      )
    })
  };

  const colorInput = useRef<HTMLInputElement | null>(null);
  // add colors
  const addMoreColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    // we raw current Date as a key of eleemnts
    const newKey = Date.now();
    const newColorInput = (
      <div className="inline" key={newKey} >
        {/* <input type="color" name="colors" key={newKey} className="w-1/2 inline" ref={colorInput} onChange={handleChange} /> */}
        <input type="color" name="color" key={newKey} className="w-1/2 inline" ref={colorInput} onChange={(e) => handleColorNQuantity(e, newKey)} />
        <button type="button" className="inline-block btn mt-0" onClick={() => deleteColor(newKey)}>Delete</button>
        <label htmlFor="quantity" >quantity</label>
        {/* <input type="number" name="quantity" id="" onChange={handleChange} /> */}
        <input type="number" name="quantity" id="" onChange={(e) => handleColorNQuantity(e, newKey)} />

      </div>
    )
    // Setting the state
    setColorArray((prevState) => ({
      ...prevState,  // Spread the previous state to keep other properties intact
      colorElements: [...prevState.colorElements, newColorInput], // Update only the colorElements array
    }));
  }
  // Remove color elements 
  const deleteColor = (key: Number) => {
    setColorArray((prevState) => {
      // // Loop over color elements in the page
      // prevState.colorElements.forEach((elem, i) => {
      //   if (elem.key === key.toString()) {
      //     // remove a value from colorsData[] based on matching index of a removed color HTML elements           
      //     prevState.colorsData.splice(i, 1)
      //   }
      // });
      // Returning updated state with filtered elements
      return {
        ...prevState,
        colorElements: prevState.colorElements.filter((element, index) => {
          // return elements that does not match the `key`
          return element.key !== key.toString();
        })
      };
    });
    // Remove item that matchs the arg (key) 
    setNewQuantity((prevState) => {
      // filter all quantity array of obj and return the once that are not matching the arg (key).
      const updatedItems = prevState.filter(item => item.index !== key);
      return updatedItems;
    });
    // Remove item that matchs the arg (key) 
    setNewColor((prevState) => {
      // filter all color array of obj and return the once that are not matching the arg (key).
      const updateColor = prevState.filter(color => color.index !== key);
      return updateColor;
    })
  };
  // Setting color and quantity of product
  const handleColorNQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    if (name === 'color') {
      setNewColor((prevState) => [
        ...prevState,
        { color: value, index: index }
      ]);
      // we would disable the <input> so we get one color per <input>
      e.target.disabled = true;
    } else if (name === 'quantity') {
      // <input type='number'> values are always string so we need to convert to an integer.  
      const numericValue = Number(value);
      // if it's not a number ( isNaN() ) and it's less than 999.
      if (!isNaN(numericValue) && numericValue <= 999) {
        setNewQuantity(prevState => [
          // provent adding multiple objs with the same index value.
          ...prevState.filter(item => item.index !== index),
          { quantity: numericValue, index: index }
        ]);
      }
    }
  }
  // Submit product
  // const postProduct = async (newProduct: Products[]) => {
  //   try {
  //     // const res = await fetch("/api/pets", {
  //     const res = await fetch("/api/products", {
  //       method: "POST",
  //       headers: {
  //         Accept: contentType,
  //         "Content-Type": contentType,
  //       },
  //       body: JSON.stringify(newProduct),
  //     });
  //     // Throw error with status code in case Fetch API req failed
  //     if (!res.ok) {
  //       throw new Error(res.status.toString());
  //     }
  //     router.push("/");
  //   } catch (error) {
  //     setMessage("Failed to add pet");
  //   };
  // }  
  // onChange event we are processing the data and setting it.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
    let getValues = e.target.value;
    // next up add all sizes for men and women to HTML
    switch (e.target.name) {
      case 'gender':
        switch (getValues) {
          case 'Men':
            // Reset all sizes back to null
            setSizeItemsForAll([null]);
            // Reset women categories to null
            setWomenItems([null])
            setMenItems([...menCategoryItems, menCategories.map((elem, index) => <option key={index} value={`m${elem}`}>{elem}</option>)]);
            // setMenItems([menCategories.map((elem, index) => <option key={index} value={`m${elem}`}>{elem}</option>)]);
            // When user select genders it should be hidden 
            setIsHidden(true);
            break;
          case 'Women':
            // Reset all sizes back to null
            setSizeItemsForAll([null])
            // Reset men categories to null
            setMenItems([null]);
            setWomenItems([...womenCategoryItems, WomenCategories.map((elem, index) => <option key={index} value={`w${elem}`}>{elem}</option>)]);
            // When user select genders it should be hidden 
            setIsHidden(true);
            break;
        }
        break;
      case 'category':
        // when Category is selected then display sizes elements.
        setIsHidden(false);
        switch (getValues) {
          case 'mJackets':
            setSizeItemsForAll({
              // sizeElements function is defined above. 
              menJackets: sizeElements(alphaSizes)
            });
            break;
          case 'mJeans':
            // Set men jeans sizes input elements            
            setSizeItemsForAll({
              // sizeElements function is defined above. 
              menJeans: sizeElements(menNumericSizes)
            });
            break;
          case 'mPants':
            // Set men pants sizes input elements                        
            setSizeItemsForAll({
              // sizeElements function is defined above. 
              menPants: sizeElements(menNumericSizes)
            });
            break;
          case "mShoes":
            // Set men shoes sizes input elements                        
            setSizeItemsForAll({
              // sizeElements function is defined above. 
              menShoes: sizeElements(menShoeSizes)
            });
            break;
          case 'mSweaters':
            // Set men sweaters sizes input elements                                    
            setSizeItemsForAll({
              // sizeElements function is defined above. 
              menSweaters: sizeElements(alphaSizes)
            });
            break;
          case 'mTees':
            // Set men tees sizes input elements                                    
            setSizeItemsForAll({
              // sizeElements function is defined above.
              menTees: sizeElements(alphaSizes)
            });
            break;
          case 'wDresses':
            // Set women dress sizes input elements                                    
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenDresses: sizeElements(alphaSizes)
            });
            break;
          case 'wJackets':
            // Set women jackets sizes input elements   
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenJackets: sizeElements(alphaSizes)
            });
            break;
          case 'wJeans':
            // Set women jeans sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenJeans: sizeElements(womenNumericSizes)
            });
            break;
          case 'wPants':
            // Set women pants sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenPants: sizeElements(womenNumericSizes)
            });
            break;
          case 'wShoes':
            // Set women shoes sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenShoes: sizeElements(womenShoeSizes)
            });
            break;
          case 'wSkirts':
            // Set women skirt sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenSkirts: sizeElements(alphaSizes)
            });
            break;
          case 'wSweaters':
            // Set women sweater sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenSweaters: sizeElements(alphaSizes)
            });
            break;
          case 'wTops':
            // Set women top sizes input elements               
            setSizeItemsForAll({
              // sizeElements function is defined above.
              womenTops: sizeElements(alphaSizes)
            });
            break;
          // next up: send an error message if user did not select any which will be the default case
          default:
            // alert('default switch')
            break;
        }
        break;
      case 'colorOnHold':
        const selectedColor = e.target.value;

        // console.log('=========e.target', e.target)
        // // =======================on hold 3 ==================================

        // Use the *latest* value of quantity directly from state or event
        // const newColorEntry = {
        //   color: selectedColor,
        //   quantity: quantity, // 🔥 This is stale unless you set it *before* adding color
        // };
        // Push directly
        // const updatedColors = [...colorArray.colorsData, newColorEntry];




        // // =======================on hold 4 ==================================
        // setColorArray((prevState) => ({
        //   ...prevState,
        //   colorsData: updatedColors,
        // }));
        // // =======================on hold 4 ==================================

        // // =======================on hold 3 ==================================

        // We are disabling the input element after getting it's value, so ONLY one value should come per input element.
        e.target.disabled = true;
        // // =======================on hold 2==================================
        // set the color state
        // setColorArray((prevState) => {
        //   // const updatedColors = [...prevState.colorsData, selectedColor];
        //   return {
        //     ...prevState,
        //     // // =======================on hold 1==================================

        //     //     // colorsData: updatedColors,
        //     //     colorsData: [...prevState.colorsData, selectedColor],
        //     // // =======================on hold 1==================================
        //     colorsData: [
        //       ...prevState.colorsData,
        //       { color: selectedColor, }
        //     ],
        //   }
        // });
        // // =======================on hold 2 ==================================
        // let updatedColorData: ColorEntry | null = null; // Variable to hold the updated color entry
        // i guess we conitue tomorrow
        // console.log('=========quantity inside color', quantity)
        // isUpdated = true;
        // so far its working tomorrow i should tested in many ways
        // =======================on hold ==================================
        // set the color state
        // setColorArray((prevState) => ({
        //   ...prevState,  // Retaining existing state properties
        //   // colorsData: storeColors,  // Setting the new colorsData
        //   colorsData: [e.target.value],  // Setting the new colorsData
        // }));
        // =======================on hold ==================================       
        break;
      // work on quantity tomorrow: for now the fisrt value is always 0 and second value is the first value
      case 'quantityONHOld':
        // console.log('=========quantity case ', e.target.value)
        // let quantityValue = e.target.value;

        // //Convert value to a number and check if it's within the allowed range
        // //value = Number(value);
        // const numericValue = Number(quantityValue);
        // console.log('=========quantity value case ', quantityValue)
        // console.log('=========numericValue case ', numericValue)

        // //Check if the value is a valid number and within the max range
        // if (!isNaN(numericValue) && numericValue <= 999) {
        //   setQuantity(numericValue);

        // }
        // console.log('=========quantity inside quantity case', quantity)


        break;
      // default:
      //   // alert('default switch')
      //   break;


    };


    // If the color or quantity was updated, apply the change to the state
    // if (isUpdated && updatedColorData) {
    //   // setColorArray((prevState) => ({
    //   //   ...prevState,
    //   //   colorsData: prevState.colorsData.map((colorEntry, idx) =>
    //   //     idx === index ? updatedColorData : colorEntry
    //   //   ),
    //   //   colorsData
    //   // }));

    //   setColorArray((prevState) => ({
    //     ...prevState,
    //     colorsData: [
    //       ...prevState.colorsData,
    //       updatedColorData
    //     ],
    //   }));
    // }
    // merge all sizes arrays
    const concatSizesArray = menShoeSizes.concat(womenShoeSizes, menNumericSizes, womenNumericSizes, alphaSizes);
    // find a size value in concatSizesArray[] that is matching the name of <input>
    const found = concatSizesArray.find((element) => element === e.target.name);
    // if Found = true; then treat the elem as a checkbox otherwise as a normal value.
    const value = found ? (e.target as HTMLInputElement).checked : e.target.value;
    // console.log('=======value postProduct', value)
    console.log('=======e.target.name ', e.target.name);

    // set the Product state
    setForm((prevState) => {
      return {
        ...prevState,
        // if targeted element name is color then add the colorArray.colorsData else the Value.
        // [e.target.name]: e.target.name === "colors" ? colorArray.colorsData : value
        [e.target.name]: value
      };
    });
  };

  // onSubmit we are send data to backend.  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //========================on hold =============================
    // setColorArray({
    //   colorsData: newColor.map((colorItem) => {
    //     const matchingQuantity = newQuantity.find(q => q.index === colorItem.index);
    //     return {
    //       color: colorItem.color,
    //       quantity: matchingQuantity ? matchingQuantity.quantity : 1,
    //     };
    //   }),
    //   colorElements: [] // populate as needed
    // });
    //========================on hold =============================

    // Build colorsData directly
    const updatedColorsData = newColor.map((colorItem) => {
      const matchingQuantity = newQuantity.find(q => q.index === colorItem.index);
      return {
        color: colorItem.color,
        quantity: matchingQuantity ? matchingQuantity.quantity : 1,
      };
    });
    // //========================on hold =============================

    // // so far its working with below method
    // const formData = {
    //   ...newProduct,
    //   colors: colorArray.colorsData, // Use latest colors here
    // };
    // //========================on hold =============================
    // setColorArray({
    //   colorsData: updatedColorsData,
    //   colorElements: [],
    // });
    const formData = {
      ...newProduct,
      colors: updatedColorsData, // Use latest colors here
      // colors: colorArray.colorsData, // Use latest colors here
    };
    console.log('============formData submit', formData)
    console.log('============newProduct on submit', newProduct)

    // =========================ONHOLD =========================== 8********************
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        Accept: contentType,
        "Content-Type": contentType,
      },
      // body: JSON.stringify(newProduct),
      body: JSON.stringify(formData),
    });
    const data = await res.json(); // Parse the JSON response    
    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    if (data.success) {
      // redirect to newly created product
      router.push({
        pathname: '/' + data.productID,
      });
    }
    // =========================ONHOLD ===========================*******************

    // =========================original ===========================
    // if (forNewProduct === true) {
    //   postProduct(newProduct);
    // }
    // =========================original ===========================

  };

  return (
    <>
      <div className="grid">
        <form id={formId} onSubmit={handleSubmit} className="w-96" >
          <label htmlFor="productName">Name</label>
          {/* <label for="productName">Name</label> */}
          <input type="text" maxLength={20} name="productName" id="productName" onChange={handleChange} />
          <label htmlFor="price">Price</label>
          <input type="number" name="price" id="price" onChange={handleChange} />
          <label htmlFor="productImg">Product Image</label>
          <input type="text" name="productImg" id="productImg" onChange={handleChange} />
          <label htmlFor="gender">Gender</label>
          <select name="gender" id="gender" className="border rounded-lg" onChange={handleChange}   >
            <option value="" >choose one</option>
            <option value="Men" >Men</option>
            <option value="Women">Women</option>
          </select>

          <label htmlFor="category">Category</label>
          <select name="category" id="category" ref={categories} className="border rounded-lg" onChange={handleChange}   >
            <option value="" >Choose Category</option>
            {menCategoryItems}
            {womenCategoryItems}
          </select>
          <div className={isHidden ? 'hidden' : " "} id="sizes">
            <p>Choose Sizes</p>
            {sizeItemsForAll.womenDresses}
            {sizeItemsForAll.womenJackets}
            {sizeItemsForAll.womenJeans}
            {sizeItemsForAll.womenPants}
            {sizeItemsForAll.womenShoes}
            {sizeItemsForAll.womenSkirts}
            {sizeItemsForAll.womenSweaters}
            {sizeItemsForAll.womenTops}
            {sizeItemsForAll.menJackets}
            {sizeItemsForAll.menJeans}
            {sizeItemsForAll.menPants}
            {sizeItemsForAll.menShoes}
            {sizeItemsForAll.menSweaters}
            {sizeItemsForAll.menTees}
          </div>
          <label htmlFor="brand">Brand</label>
          <input type="text" name="brand" id="brand" className="capitalize" onChange={handleChange} />
          <label htmlFor="kids">Kids</label>
          <select name="kids" id="kids" className="border rounded-lg" onChange={handleChange}   >
            <option value="" >choose one</option>
            <option value="Boys" >Boys</option>
            <option value="Girls">Girls</option>
          </select>
          <div className="color-picker">
            {/* <div className="inline" >
              <input type="color" name="color"  ref={colorInput} className="w-1/2 block" onChange={handleChange}  />
              <button type="button" className="inline-block btn mt-0" onClick={() => deleteColor(Date.now())}>Delete</button>

            </div> */}
            {colorArray.colorElements}
            <button type="button" className="btn" onClick={addMoreColor}>Add Color</button>
          </div>

          <label htmlFor="author">Author</label>
          <input type="text" name="author" id="author" onChange={handleChange} />
          <label htmlFor="inStock">In Stock</label>
          <select name="inStock" id="inStock" className="border rounded-lg" onChange={handleChange}   >
            <option value="" >choose one</option>
            <option value="true" >True </option>
            <option value="false">false</option>
          </select>
          <button type="submit" className="btn"> Submit</button>
        </form>
      </div>
    </>
  )
}

export default Form;