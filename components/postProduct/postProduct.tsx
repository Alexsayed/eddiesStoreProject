import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ReactDOM from 'react-dom';
import { mutate } from "swr";
import product, { Products } from "../../models/products";
import Size, { ISizes } from "../../models/sizes";
import { arrayBuffer } from "stream/consumers";
import { BsPen, BsTrash } from "react-icons/bs";
import usaStates, { staticMenCategories, staticWomenCategories, staticMenShoeSizes, staticWomenShoeSizes, staticMenNumericSizes, staticWomenNumericSizes, staticAlphaSizes } from "../../staticData/usStates";

type ColorItem = {
  color: string;
  index: number;
};
type QuantityItem = {
  quantity: number;
  index: number;
};
interface ColorArray {
  colorElements: JSX.Element[]; // Specifically an array of JSX elements (the input buttons)
}
interface ProductForm {
  productName: string;
  price: number;
  productImg: string[];
  category: string;
  brand: string;
  gender: string;
  colors: { color: string; quantity: number }[];
  sizes: { [size: string]: boolean };
  author: string;
  inStock: boolean;
}

// Handle Post new product.
const Form = () => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [menCategories, setMenCategories] = useState<string[]>(staticMenCategories);
  const [womenCategories, setWomenCategories] = useState<string[]>(staticWomenCategories);
  const [menShoeSizes, setMenShoeSizes] = useState<string[]>(staticMenShoeSizes);
  const [womenShoeSizes, setWomenShoeSizes] = useState<string[]>(staticWomenShoeSizes);
  const [menNumericSizes, setMenNumericSizes] = useState<string[]>(staticMenNumericSizes);
  const [womenNumericSizes, setWomenNumericSizes] = useState<string[]>(staticWomenNumericSizes);
  const [alphaSizes, setAlphaSizes] = useState<string[]>(staticAlphaSizes);
  // New product structure/interface
  const [newProduct, setForm] = useState<ProductForm>({
    productName: '',
    price: 0,
    productImg: [],
    category: '',
    brand: '',
    gender: '',
    colors: [],
    sizes: {},
    author: '',
    inStock: false,
  });
  // Selectors   
  const categories = useRef<HTMLSelectElement>(null);
  const colorInput = useRef<HTMLInputElement | null>(null);
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
  const [newQuantity, setNewQuantity] = useState<QuantityItem[]>([]);
  const [newColor, setNewColor] = useState<ColorItem[]>([]); // Start with an empty array
  const [imgFile, setImgFile] = useState<File[]>([]);
  const [colorArray, setColorArray] = useState<ColorArray>({
    colorElements: [],
  });
  // Reset all hooks. This function is callled when form is submitted and was successfull.
  const resetFormState = () => {
    setErrors({});
    setMessage("");
    // Reset category selections
    setMenItems([]);
    setWomenItems([]);
    // Reset size items for men and women
    setSizeItemsForAll({
      menJackets: [],
      menJeans: [],
      menPants: [],
      menShoes: [],
      menSweaters: [],
      menTees: [],
      womenDresses: [],
      womenJackets: [],
      womenJeans: [],
      womenPants: [],
      womenShoes: [],
      womenSkirts: [],
      womenSweaters: [],
      womenTops: [],
    });
    // Reset quantity and color
    setNewQuantity([]);
    setNewColor([]);
    setImgFile([]); // Reset image files    
    setColorArray({ colorElements: [] }); // Reset color array    
    setIsHidden(true); // Reset visibility

  };
  // Handle setting the sizes
  const sizeElements = (arg: string[]) => {
    return arg.map((elem, i) => {
      return (
        < div key={i} className="flex  items-center ">
          <label htmlFor={elem} className="m-0 w-12 text-left" >{elem} :</label>
          <input type="checkbox" name={elem} className="w-7 h-7 rounded-lg" onChange={handleChange} />
        </div>
      )
    })
  };
  // Add colors elements 
  const addMoreColor = (e: React.MouseEvent<HTMLButtonElement | HTMLInputElement>) => {
    const newKey = Date.now(); // we raw current Date as a key of eleemnts
    const newColorInput = (
      <div key={newKey} className="flex gap-2 col-span-3 mb-2 ">
        <input type="color" name="color" key={newKey} className="border   rounded-lg cursor-pointer" ref={colorInput} onChange={(e) => handleColorNQuantity(e, newKey)} required />
        <input type="number" name="quantity" id="quantity" className="border rounded-lg  pl-0.5" placeholder="Quantity" onChange={(e) => handleColorNQuantity(e, newKey)} required />
        <button type="button" className=" border rounded-lg bg-red-500  text-white px-2  " onClick={() => deleteColor(newKey)}><BsTrash /></button>
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
      // Returning updated state with filtered elements
      return {
        ...prevState,
        colorElements: prevState.colorElements.filter((element, index) => {
          // return elements that does not match the `key`. Meaning: delete the clicked color and return the rest. 
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
      e.target.disabled = true; // we would disable the <input> so we get one color per <input>
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

  // onChange event we are processing the data and setting it.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
    let getValues = e.target.value;
    switch (e.target.name) {
      case 'gender':
        switch (getValues) {
          case 'Men':
            setSizeItemsForAll([null]); // Reset all sizes back to null            
            setWomenItems([null]); // Reset women categories to null
            setMenItems([...menCategoryItems, menCategories.map((elem, index) => <option key={index} value={`m${elem}`}>{elem}</option>)]);
            setIsHidden(true); // When user select genders size elements should be hidden 
            break;
          case 'Women':
            setSizeItemsForAll([null]); // Reset all sizes back to null           
            setMenItems([null]);  // Reset men categories to null
            setWomenItems([...womenCategoryItems, womenCategories.map((elem, index) => <option key={index} value={`w${elem}`}>{elem}</option>)]);
            setIsHidden(true); // When user select genders size elements should be hidden 
            break;
        }
        break;
      case 'category':
        setIsHidden(false); // when Category is selected then display sizes elements.
        switch (getValues) {
          case 'mJackets':
            // Set men jackets sizes input elements       
            setSizeItemsForAll({ menJackets: sizeElements(alphaSizes) }); // sizeElements function is defined above.            
            break;
          case 'mJeans':
            // Set men jeans sizes input elements 
            setSizeItemsForAll({ menJeans: sizeElements(menNumericSizes) });
            break;
          case 'mPants':
            // Set men pants sizes input elements                   
            setSizeItemsForAll({ menPants: sizeElements(menNumericSizes) });
            break;
          case "mShoes":
            // Set men shoes sizes input elements                   
            setSizeItemsForAll({ menShoes: sizeElements(menShoeSizes) });
            break;
          case 'mSweaters':
            // Set men sweaters sizes input elements             
            setSizeItemsForAll({ menSweaters: sizeElements(alphaSizes) });
            break;
          case 'mTees':
            // Set men tees sizes input elements                       
            setSizeItemsForAll({ menTees: sizeElements(alphaSizes) });
            break;
          case 'wDresses':
            // Set women dress sizes input elements                 
            setSizeItemsForAll({ womenDresses: sizeElements(alphaSizes) });
            break;
          case 'wJackets':
            // Set women jackets sizes input elements              
            setSizeItemsForAll({ womenJackets: sizeElements(alphaSizes) });
            break;
          case 'wJeans':
            // Set women jeans sizes input elements                     
            setSizeItemsForAll({ womenJeans: sizeElements(womenNumericSizes) });
            break;
          case 'wPants':
            // Set women pants sizes input elements               
            setSizeItemsForAll({ womenPants: sizeElements(womenNumericSizes) });
            break;
          case 'wShoes':
            // Set women shoes sizes input elements                  
            setSizeItemsForAll({ womenShoes: sizeElements(womenShoeSizes) });
            break;
          case 'wSkirts':
            // Set women skirt sizes input elements                       
            setSizeItemsForAll({ womenSkirts: sizeElements(alphaSizes) });
            break;
          case 'wSweaters':
            // Set women sweater sizes input elements               
            setSizeItemsForAll({ womenSweaters: sizeElements(alphaSizes) });
            break;
          case 'wTops':
            // Set women top sizes input elements                       
            setSizeItemsForAll({ womenTops: sizeElements(alphaSizes) });
            break;
          default:
            break;
        }
        break;
      default:
        break;
    };

    // merge all sizes arrays
    const concatSizesArray = menShoeSizes.concat(womenShoeSizes, menNumericSizes, womenNumericSizes, alphaSizes);
    // find a size value in concatSizesArray[] that is matching the name of <input>
    const found = concatSizesArray.find((element) => element === e.target.name);
    // if Found = true; then treat the elem as a checkbox otherwise as a normal value.
    let value = found ? (e.target as HTMLInputElement).checked : e.target.value;
    // Capitalize the first letter of below input fields
    const capitalizeFields = ['productName', 'brand', 'author'];
    if (capitalizeFields.includes(e.target.name) && typeof value === 'string') {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    };
    // set the Product data
    setForm((prevState) => {
      if (typeof value === 'string') {
        return {
          ...prevState,
          [e.target.name]: value // Directly assign string values
        };
      } else if (typeof value === 'boolean') {  // if it's boolean              
        return {
          ...prevState,
          sizes: {
            ...prevState.sizes,
            [e.target.name]: value, // Add/update size dynamically
          },
        }
      }
      return prevState;
    });
  };
  // Handle uploading images 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files); // Convert FileList to File[]. Meaning we can now loop through it fileArray      
      setImgFile(fileArray);
    }
  };

  // onSubmit we are send data to backend.  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle colorsData
    const updatedColorsData = newColor.map((colorItem) => {
      // find color and it's quantity by corresponding index. 
      const matchingQuantity = newQuantity.find(q => q.index === colorItem.index);
      return { // return the data
        color: colorItem.color,
        quantity: matchingQuantity ? matchingQuantity.quantity : 1,
      };
    });
    // create FormData object.
    const formDataToSend = new FormData();
    // Adding a key/value pairs to FormData(); using append():
    formDataToSend.append('productName', newProduct.productName);
    formDataToSend.append('price', newProduct.price.toString());
    // append() image files to FormData()
    imgFile.forEach((file, index) => {
      formDataToSend.append('productImg', file); // Or 'productImgs[]' if your backend expects an array
    });
    formDataToSend.append('category', newProduct.category)
    formDataToSend.append('brand', newProduct.brand)
    formDataToSend.append('gender', newProduct.gender)
    formDataToSend.append('colors', JSON.stringify(updatedColorsData));
    formDataToSend.append('sizes', JSON.stringify(newProduct.sizes))
    formDataToSend.append('author', newProduct.author)
    formDataToSend.append('inStock', newProduct.inStock.toString())
    // Submit the Form       
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });
      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      const data = await res.json();
      if (data.success) {
        resetFormState(); // reset all hooks/useState here
        // redirect to newly created product
        router.push({ pathname: '/' + data.productID, });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <>
      <div className="  mt-10 md:mt-0  border-t md:border-none pt-4 ">
        <div className="w-[90%] md:w-[60%] mx-auto ">
          <h1 className="text-xl font-semibold text-center">Add New Product</h1>
          {message && <div className='text-red-500'>{message}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3" >
            <div className="flex items-center ">
              <label htmlFor="productName" className="w-20">Name:</label>
              <input type="text" maxLength={20} name="productName" id="productName" className="capitalize border flex-1 pl-2 rounded-lg " placeholder="Product Name" onChange={handleChange} />
            </div>
            <div className="flex items-center">
              <label htmlFor="price" className="w-20">Price:</label>
              <input type="number" name="price" id="price" className="border flex-1 pl-2 rounded-lg" placeholder="Price" onChange={handleChange} />
            </div>
            <div className="flex items-center">
              <label htmlFor="brand" className="w-20">Brand:</label>
              <input type="text" name="brand" id="brand" className="capitalize border flex-1 pl-2 rounded-lg" placeholder="Brand Name" onChange={handleChange} />
            </div>
            <div className="flex items-center h-[30px]">
              <label htmlFor="productImg" className="w-20 ">Images:</label>
              <div className="border flex-1  rounded-[10px] text-sm">
                <input type="file" name="productImg" id="productImg"
                  className="file:h-[30px] file:mr-4 file:py-0 file:px-2 file:rounded-lg file:border-0 file:text-sm 
                             file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 " onChange={handleFileChange} accept="image/*" multiple />
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="gender" className="w-20">Gender:</label>
              <select name="gender" id="gender" className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="Men" >Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="category" className="w-20">Category:</label>
              <select name="category" id="category" ref={categories} className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" onChange={handleChange} required >
                <option value="" >Choose Category:</option>
                {menCategoryItems}
                {womenCategoryItems}
              </select>
            </div>
            <div className={isHidden ? 'hidden' : "flex items-start "} id="sizes">
              <label htmlFor="sizes" className="w-20">Sizes:</label>
              < div className="grid grid-cols-3 gap-2 border rounded-lg p-1 flex-1">
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
            </div>
            <div className="flex items-start ">
              <label htmlFor="pickColor" className="w-20">Color:</label>
              <div className="grid grid-cols-1 flex-1 border rounded-lg p-1">
                {colorArray.colorElements}
                <input type="button" className="capitalize border pl-2 text[#0b81fa] text-violet-700 bg-violet-50 hover:bg-violet-100 flex-1 rounded-lg" placeholder="Brand Name" onClick={addMoreColor} value="Add Color" />
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="author" className="w-20">Author:</label>
              <input type="text" name="author" id="author" className="capitalize border flex-1 pl-2 rounded-lg" placeholder="Author" onChange={handleChange} />
            </div>
            <div className="flex items-center">
              <label htmlFor="inStock" className="w-20">In Stock:</label>
              <select name="inStock" id="inStock" className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="true" >True </option>
                <option value="false">false</option>
              </select>
            </div>
            <button type="submit" className="btn bg-slate-700 text-white border-none md:w-1/2 md:mx-auto mb-4">Submit Post</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Form;