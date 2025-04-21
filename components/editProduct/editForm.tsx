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
    color: product.color,
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
  // Handle changes. colorIndex: is a optional arg, handleChange in most cases has 1 arg but for editing color we need index of specific input elm so we can update the correct product.color[] 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, colorIndex?: any) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    console.log('===============e', e.target)
    if (type === 'checkbox') {
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
    } else if (type === 'color') {
      // Editing product color.
      setForm((prevState: any) => {
        const updatedColors = [...prevState.color]; // Create a shallow copy of the color array       
        updatedColors[colorIndex] = value; // Update the value at the specified index    
        return { ...prevState, color: updatedColors };// Return the updated state with the modified color array

      });
    } else {
      // if it's not a checkbox then update the fields 
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  // Handle Adding more colors.
  const addMoreColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    // To add more colors we would simply update the (setForm) by adding a default color("#000000") which is black in product.color[].
    setForm((prevState: any) => {
      const updatedColors = [...prevState.color]; // Create a shallow copy of the color array
      updatedColors.push("#000000");
      return { ...prevState, color: updatedColors }
    })
  };
  // Function to handle color deletion
  const deleteColor = (key: Number) => {
    setForm((prevState: any) => {
      const deleteColors = [...prevState.color]; // Create a shallow copy of the color array            
      return {
        ...prevState,
        color: deleteColors.filter((elem, index) => {
          return index !== key; // Remove color at the specified index
        })
      }
    })
  };
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
  // Next up: we will create sizes checkbox
  return (
    <>
      <div>
        <form id={editFormId} onSubmit={handleEditSubmit}>
          <label htmlFor="productName">Name</label>
          <input type="text" name="productName" defaultValue={product.productName} onChange={handleChange} />
          <label htmlFor="price">Price</label>
          <input type="number" name="price" defaultValue={product.price} onChange={handleChange} required />
          <label htmlFor="productImg">Product Image</label>
          <input type="text" name="productImg" defaultValue={product.productImg} onChange={handleChange} required />
          <label htmlFor="category">Category</label>
          <select name="category" className="border rounded-lg" defaultValue={product.category}  >
            <option key={0} value={product.category}>{product.category.slice(1)}</option>
          </select>
          <label htmlFor="brand">Brand</label>
          <input type="text" name="brand" defaultValue={product.brand} onChange={handleChange} required />
          <label htmlFor="gender">Gender</label>
          <select name="gender" className="border rounded-lg" defaultValue={product.gender}    >
            <option key={0} value={product.gender}>{product.gender}</option>
          </select>
          <label htmlFor="kids">Kids</label>
          <select name="kids" className="border rounded-lg" defaultValue={product.kids} onChange={handleChange}   >
            <option value="" >choose one</option>
            <option value="Boys" >Boys</option>
            <option value="Girls">Girls</option>
          </select>
          <div className="border rounded">
            <label htmlFor="color">Colors:</label>
            {editForm.color.map((color, index) => (
              <div className="inline" key={index} >
                <input type="color" name="color" key={index} defaultValue={color} className="w-1/2 inline" onChange={(e) => handleChange(e, index)} />
                <button type="button" className="inline-block btn mt-0" onClick={() => deleteColor(index)}>Delete</button>
              </div>
            ))}
            <button type="button" className="btn" onClick={addMoreColor}>Add More Color</button>
          </div>
          <label htmlFor="sizes">Select Sizes:</label>
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
          <label htmlFor="author">Author</label>
          <input type="text" name="author" defaultValue={product.author} onChange={handleChange} required />
          <label htmlFor="inStock">In Stock</label>
          <select name="inStock" className="border rounded-lg" defaultValue={String(product.inStock)} onChange={handleChange} required  >
            <option value="" >choose one</option>
            <option value="true" >True </option>
            <option value="false">False</option>
          </select>
          <button type="submit" className="btn"> Submit</button>
        </form>
      </div >
    </>
  )
};

export default editProduct;