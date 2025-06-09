import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Products } from "../../models/products";
import Size, { ISizes } from "../../models/sizes";
// import { useSession } from 'next-auth/react';
type Props = {
  editFormId: string;
  product: Products;
};
// Define the type for updatedSizes where each category is a Record of string keys to booleans
type SizeCategory = Record<string, boolean>;
// Define the structure of updatedSizes
interface SizesInterface {
  menSizes: Record<string, SizeCategory>;
  womenSizes: Record<string, SizeCategory>;
};

// The 2 args (editFormId, product ) is related to pages/[id]/edit. So we define the properties there and display them here.
const editProduct = ({ editFormId, product, }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  // setting interface of Products schema.
  const [editForm, setForm] = useState({
    _id: product._id,
    productName: product.productName,
    price: product.price,
    productImg: product.productImg,
    category: product.category,
    brand: product.brand,
    gender: product.gender,
    kids: product.kids,
    colors: product.colors,
    sizes: product.sizes,
    author: product.author,
    inStock: product.inStock,
    created: product.created
  });
  const [message, setMessage] = useState("");
  const [productEditSize, setEditSizes] = useState<any>([]);
  const { id } = router.query;
  // const { data: session, status } = useSession();
  // console.log('==========stsus', status)
  // console.log('==========session', session)
  // console.log('==========session useEffect', session)
  // if (status === 'loading') { 
  //   return <div>Loading...</div>;
  // } else if (status === 'unauthenticated') {
  //   return <div>unauthenticated</div>;
  // }

  // Setting the Sizes checkboxs
  useEffect(() => {
    let categoriesWithTrueValue: any = {};

    if (product.gender === 'Women') {
      for (const category in product.sizes.womenSizes) {
        // Extracting ONLY sizes obj ({XS: false, S: true, M: true, L: true, XL: false, ...etc}) without category name on it.
        const sizes = product.sizes.womenSizes[category as keyof typeof product.sizes.womenSizes]; //Here, keyof typeof product.sizes.womenSizes ensures that category is one of the valid keys ('dresses', 'jackets', etc.).  
        // if sizes value is True then we will extract that obj     
        if (Object.values(sizes).includes(true)) {
          // assign the whole sizes obj, that has at least 1 True size.
          categoriesWithTrueValue = sizes;
        }
      }
      // when True sizes found (categoriesWithTrueValue) then we will set the state with whole obj with it's value 
      setEditSizes(categoriesWithTrueValue);
    } else {
      for (const category in product.sizes.menSizes) {
        const sizes = product.sizes.menSizes[category as keyof typeof product.sizes.menSizes];
        if (Object.values(sizes).includes(true)) {
          categoriesWithTrueValue = sizes;
        }
      }
      setEditSizes(categoriesWithTrueValue);
    }
  }, [product]);
  // console.log('===============product', product)

  // Handle changes. colorIndex: is a optional arg, handleChange in most cases has 1 arg but for editing color we need index of specific input elm so we can update the correct product.color[] 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, colorIndex?: any) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    // console.log('===============e', e.target)
    if (type === 'checkbox') {
      // console.log('===============checkbox type: ', type)

      // setting the (setEditSizes) for visual confirmation of checkboxes
      setEditSizes((prev: any) => ({
        ...prev,
        [name]: checked,
      }));
      // Update the relevant size object
      setForm((prevState: any) => {
        // SizesInterface is declared above.
        const updatedSizes: SizesInterface = { ...prevState.sizes };
        if (prevState.gender === 'Women') {
          for (let [category, sizes] of Object.entries(updatedSizes.womenSizes)) {
            // find True values in the Size obj.
            const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
            if (trueSizes.length > 0) {
              // here we are updating the updatedSizes.womenSizes[category].
              // HOW IT WORKS: updatedSizes.womenSizes[category as keyof typeof updatedSizes.womenSizes] =  is equal to COPY of itself,
              //               with addition of [name]: checked. Name = S,M,L...etc. and checked = value of input
              updatedSizes.womenSizes[category as keyof typeof updatedSizes.womenSizes] = {
                ...updatedSizes.womenSizes[category as keyof typeof updatedSizes.womenSizes],
                [name]: checked,
              };
            }
          }
        } else {
          for (let [category, sizes] of Object.entries(updatedSizes.menSizes)) {
            const trueSizes = Object.entries(sizes).filter(([size, isTrue]) => isTrue);
            if (trueSizes.length > 0) {
              updatedSizes.menSizes[category as keyof typeof updatedSizes.menSizes] = {
                ...updatedSizes.menSizes[category as keyof typeof updatedSizes.menSizes],
                [name]: checked,
              };
            }
          }
        }
        // updatedSizes: holds the new of selected checkboxes       
        return { ...prevState, sizes: updatedSizes };
      });
      // } else if (type === 'color') {
    } else if (name === 'color') {
      // console.log('=========(type === color name', name);
      // console.log('=========(type === color value', value);

      // Editing product color.
      setForm((prevState: any) => {
        const updatedColors = [...prevState.colors]; // Create a shallow copy of the color array 
        // console.log('=========updatedColors top', updatedColors);
        // console.log('=========updatedColors top', updatedColors[colorIndex]);

        // updatedColors[colorIndex] = value; // Update the value at the specified index  
        updatedColors[colorIndex] = { color: value, quantity: updatedColors[colorIndex].quantity }; // Update the value at the specified index  
        // console.log('=========updatedColors bottom', updatedColors);

        return { ...prevState, colors: updatedColors };// Return the updated state with the modified color array
        // return { ...prevState, updatedColors };// Return the updated state with the modified color array
      });
      // console.log('=========editForm', editForm);
    } else if (name === 'quantity') {
      // console.log('=========else quantity name:  ', name);
      // console.log('=========else quantity value', value);
      const numericValue = Math.max(1, Number(value)); // 👈 enforce min of 1. quantity must 1 or greater
      // if it's not a number ( isNaN() ) and it's less than 999.
      if (!isNaN(numericValue) && numericValue <= 999) {
        setForm((prevState: any) => {
          const updatedQuantity = [...prevState.colors]; // Create a shallow copy of the color array 
          // console.log('=========updatedQuantity top', updatedQuantity);
          // console.log('=========updatedQuantity top', updatedQuantity[colorIndex]);
          // console.log('=========colorIndex', colorIndex);
          updatedQuantity[colorIndex] = { color: updatedQuantity[colorIndex].color, quantity: numericValue }; // Update the value at the specified index  
          // console.log('=========updatedQuantity bottom', updatedQuantity);

          return { ...prevState, colors: updatedQuantity };// Return the updated state with the modified color array
        });
      }
      // console.log('=========editForm quantity', editForm);

    } else {
      // console.log('=========else :  ', name);

      // if it's not a checkbox then update the fields 
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  // Handle Adding more colors.
  const addMoreColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    // To add more colors we would simply update the (setForm) by adding a default {color:"#000000", quantity: 1} which is black in product.colors[{}].
    setForm((prevState: any) => {
      const updatedColors = [...prevState.colors]; // Create a shallow copy of the color array
      // console.log('=========updatedColors', updatedColors);
      updatedColors.push({ color: "#000000", quantity: 1 });
      return { ...prevState, colors: updatedColors }
    })
  };
  // Function to handle color deletion
  const deleteColor = (key: Number) => {
    setForm((prevState: any) => {
      const deleteColors = [...prevState.colors]; // Create a shallow copy of the color array            
      return {
        ...prevState,
        colors: deleteColors.filter((elem, index) => {
          return index !== key; // Remove color at the specified index
        })
      }
    })
  };
  // console.log('=========editForm outside', editForm);

  // Function to handle submission
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // (as Products): means interface of mongoose Products model
    putData(editForm as Products);
    // }
  };
  // Handle function. Sending data to api/products/[id].ts
  const putData = async (editForm: Products) => {
    try {
      // const res = await fetch(`/api/pets/${id}`, {
      const res = await fetch('http://localhost:3000/api/products/' + id, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        // assinging edit inputs to the body of the api/products/[id].ts file
        body: JSON.stringify(editForm),
        // body: JSON.stringify(value)
      });
      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      // router.push(window.location.href);
      router.push('/');
    } catch (error) {
      setMessage("Failed to update pet");
    }
  }
  // Next up: work on images
  return (
    <>
      <div className=" relative top-[40px] md:top-0 md:top-0  border-t md:border-none pt-4 ">
        <div className="w-[90%] md:w-[60%] mx-auto ">
          <h1 className="text-xl font-semibold text-center">Edit Product</h1>

          {/* <form id={editFormId} onSubmit={handleEditSubmit} className="flex mt-4 gap-2 hidden"> */}

          {/* <div className="w-auto flex flex-col justify-between ">
              <label className="mt-0 " htmlFor="productName">Name:</label>
              <label className="mt-0 " htmlFor="price">Price:</label>
              <label className="mt-0 " htmlFor="productImg">Image:</label>
              <label className="mt-0 " htmlFor="category">Category:</label>
              <label className="mt-0 " htmlFor="brand">Brand:</label>
              <label className="mt-0" htmlFor="gender">Gender:</label>
              <label className="mt-0" htmlFor="color">Colors:</label>
              <label className="mt-0" htmlFor="sizes">Select Sizes:</label>
              <label className="mt-0" htmlFor="author">Author:</label>
              <label className="mt-0" htmlFor="inStock">In Stock:</label>

            </div> */}

          {/* <div className="w-1/2 flex flex-col justify-between  ">
              <input type="text" name="productName" id="productName" className="border  pl-2 ml-1" defaultValue={product.productName} onChange={handleChange} required />
              <input type="number" name="price" id="price" className="border  pl-2 ml-1" defaultValue={product.price} onChange={handleChange} required />
              <input type="text" name="productImg" id="productImg" className="border pl-2 ml-1" defaultValue={product.productImg} onChange={handleChange} required />
              <select name="category" id="category" className="border rounded-lg pl-2 ml-1" defaultValue={product.category}  >
                <option key={0} value={product.category}>{product.category.slice(1)}</option>
              </select>
              <input type="text" id="brand" name="brand" className="border  pl-2 ml-1" defaultValue={product.brand} onChange={handleChange} required />
              <select name="gender" id="gender" className="border rounded-lg" defaultValue={product.gender}    >
                <option key={0} value={product.gender}>{product.gender}</option>
              </select>
              <div className="border rounded" id="color">
                {editForm.colors.map((elem, index) => (
                  <div className="inline" key={index} >
                    <input type="color" id="color" name="color" key={index} value={elem.color} className="w-1/2 inline" onChange={(e) => handleChange(e, index)} />
                    <input type="number" name="quantity" value={elem.quantity} className="w-32 inline mx-2" onChange={(e) => handleChange(e, index)} />

                    <button type="button" className="inline-block btn mt-0" onClick={() => deleteColor(index)}>Delete</button>
                  </div>
                ))}
                <button type="button" className="btn" onClick={addMoreColor}>Add More Color</button>
              </div>

              <div className='' id="sizes">
                {productEditSize.length === 0 ? (
                  <p>No sizes available</p>
                ) : (
                  Object.keys(productEditSize).map((name, i) => {
                    const size = productEditSize[name as keyof typeof productEditSize];
                    return (
                      < div key={i} className="inline-block w-20 ">
                        <label htmlFor={name} className="inline-block">{name}</label>
                        <input type="checkbox" name={name} className="inline-block w-10 ahahha" onChange={handleChange} checked={size} />
                      </div>
                    )
                  })
                )}
              </div>
              <input type="text" name="author" id="author" defaultValue={product.author} onChange={handleChange} required />
              <select name="inStock" id="inStock" className="border rounded-lg" defaultValue={String(product.inStock)} onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="true" >True </option>
                <option value="false">False</option>
              </select>
            </div> */}

          {/* <div>
              <label className="m-0 inline" htmlFor="category">Category</label>
              <select name="category" className="border rounded-lg" defaultValue={product.category}  >
                <option key={0} value={product.category}>{product.category.slice(1)}</option>
              </select>
            </div>
            <div className="my-2">
              <label className="m-0 inline" htmlFor="brand">Brand</label>
              <input type="text" name="brand" defaultValue={product.brand} onChange={handleChange} required />
            </div>
            <div className="my-2">
              <label className="m-0 inline" htmlFor="gender">Gender</label>
              <select name="gender" className="border rounded-lg" defaultValue={product.gender}    >
                <option key={0} value={product.gender}>{product.gender}</option>
              </select>
            </div>
            <div className="my-2">
              <label className="m-0 inline" htmlFor="kids">Kids</label>
              <select name="kids" className="border rounded-lg" defaultValue={product.kids} onChange={handleChange}   >
                <option value="" >choose one</option>
                <option value="Boys" >Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>
            <div className="border rounded">
              <label htmlFor="color">Colors:</label>
              {editForm.colors.map((elem, index) => (
                <div className="inline" key={index} >
                  <input type="color" name="color" key={index} value={elem.color} className="w-1/2 inline" onChange={(e) => handleChange(e, index)} />
                  <input type="number" name="quantity" value={elem.quantity} className="w-32 inline mx-2" onChange={(e) => handleChange(e, index)} />

                  <button type="button" className="inline-block btn mt-0" onClick={() => deleteColor(index)}>Delete</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={addMoreColor}>Add More Color</button>
            </div>
            <label className="m-0 inline" htmlFor="sizes">Select Sizes:</label>
            <div className='' id="sizes">
              {productEditSize.length === 0 ? (
                <p>No sizes available</p>
              ) : (
                Object.keys(productEditSize).map((name, i) => {
                  const size = productEditSize[name as keyof typeof productEditSize];
                  return (
                    < div key={i} className="inline-block w-20 ">
                      <label htmlFor={name} className="inline-block">{name}</label>
                      <input type="checkbox" name={name} className="inline-block w-10 ahahha" onChange={handleChange} checked={size} />
                    </div>
                  )
                })
              )}
            </div>
            <div className="my-2">
              <label className="m-0 inline" htmlFor="author">Author</label>
              <input type="text" name="author" defaultValue={product.author} onChange={handleChange} required />
            </div>
            <div className="my-2">
              <label className="m-0 inline" htmlFor="inStock">In Stock</label>
              <select name="inStock" className="border rounded-lg" defaultValue={String(product.inStock)} onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="true" >True </option>
                <option value="false">False</option>
              </select>
            </div> */}
          {/* <button type="submit" className="btn"> Submit</button> */}

          {/* </form> */}

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <div className="flex items-center">
              <label htmlFor="productName" className="w-28">Name:</label>
              <input type="text" id="productName" name="productName" className="border flex-1 pl-2" defaultValue={product.productName} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="price" className="w-28">Price:</label>
              <input type="number" id="price" name="price" className="border flex-1 pl-2" defaultValue={product.price} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="productImg" className="w-28">Image:</label>
              <input type="text" id="productImg" name="productImg" className="border flex-1 pl-2" defaultValue={product.productImg} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="category" className="w-28">Category:</label>
              <select name="category" id="category" className="border rounded-lg flex-1 pl-2 bg-white" defaultValue={product.category}  >
                <option key={0} value={product.category}>{product.category.slice(1)}</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="brand" className="w-28">Brand:</label>
              <input type="text" id="brand" name="brand" className="border flex-1 pl-2" defaultValue={product.brand} onChange={handleChange} required />
            </div>

            <div className="flex items-center">
              <label htmlFor="gender" className="w-28">Gender:</label>
              <select name="gender" id="gender" className="border rounded-lg flex-1 pl-2 bg-white" defaultValue={product.gender}    >
                <option key={0} value={product.gender}>{product.gender}</option>
              </select>
            </div>
            <div className="flex items-start">
              <label htmlFor="color" className="w-28 pt-2">Colors:</label>
              <div className="flex-1 border rounded p-2" id="color">
                {editForm.colors.map((elem, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input type="color" name="color" className="border" value={elem.color} onChange={(e) => handleChange(e, index)} />
                    <input type="number" name="quantity" className='border rounded-lg w-12 pl-1' value={elem.quantity} onChange={(e) => handleChange(e, index)} />
                    <button type="button" className="  rounded-lg py-[3px]  px-2 bg-red-600 text-white" onClick={() => deleteColor(index)}>Delete</button>
                  </div>
                ))}
                <button type="button" className="btn bg-cyan-600 text-white mt-2.5 border-none mx-auto" onClick={addMoreColor}>Add More Color</button>
              </div>
            </div>
            <div className="flex items-start">
              <label htmlFor="sizes" className="w-28">Select Sizes:</label>
              <div className='flex-1 flex flex-wrap items-center gap-4 border rounded p-2' id="sizes">
                {productEditSize.length === 0 ? (
                  <p>No sizes available</p>
                ) : (
                  Object.keys(productEditSize).map((name, i) => {
                    const size = productEditSize[name as keyof typeof productEditSize];
                    return (
                      < div key={i} className="flex  items-center gap-1 ">
                        <label htmlFor={name} className="m-0 ">{name}:</label>
                        <input type="checkbox" name={name} id={name} className="w-7 h-7" onChange={handleChange} checked={size} />

                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="author" className="w-28">Author:</label>
              <input type="text" name="author" id="author" className="border flex-1 pl-2" defaultValue={product.author} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="inStock" className="w-28">In Stock:</label>
              <select name="inStock" id="inStock" className="border rounded-lg flex-1 pl-2" defaultValue={String(product.inStock)} onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="true" >True </option>
                <option value="false">False</option>
              </select>
            </div>
            <button type="submit" className="btn bg-slate-700 text-white border-none"> Submit</button>
          </form>

        </div >
      </div >
    </>
  )
};

export default editProduct;