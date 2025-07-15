import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Products } from "../../models/products";
import Size, { ISizes } from "../../models/sizes";
// import { useSession } from 'next-auth/react';
import { GoChevronDown } from "react-icons/go";
import { SlArrowDown } from "react-icons/sl";
type Props = {
  // editFormId: string;
  product: Products;
};
// Define the type for updatedSizes where each category is a Record of string keys to booleans
type SizeCategory = Record<string, boolean>;
// Define the structure of updatedSizes
interface SizesInterface {
  menSizes: Record<string, SizeCategory>;
  womenSizes: Record<string, SizeCategory>;
};

// The 2 args ( product ) is related to pages/[id]/edit. So we define the properties there and display them here.
const editProduct = ({ product, }: Props) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  // setting original values
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
  const [productEditImages, setEditImages] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isHiddenImages, setIsHiddenImages] = useState(true);
  const { id } = router.query;

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
    setEditImages(product.productImg)
  }, [product]);


  // Handle changes. colorIndex: is a optional arg, handleChange in most cases has 1 arg but for editing color we need index of specific input elm so we can update the correct product.color[] 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, colorIndex?: any) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
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
    } else if (name === 'color') {
      // Editing product color.
      setForm((prevState: any) => {
        const updatedColors = [...prevState.colors]; // Create a shallow copy of the color array                 
        updatedColors[colorIndex] = { color: value, quantity: updatedColors[colorIndex].quantity }; // Updates the value at the specified index         
        return { ...prevState, colors: updatedColors };// Return the updated state with the modified color array        
      });
    } else if (name === 'quantity') {
      const numericValue = Math.max(1, Number(value)); // enforce min of 1. quantity must 1 or greater
      // if it's not a number ( isNaN() ) and it's less than 999.
      if (!isNaN(numericValue) && numericValue <= 999) {
        setForm((prevState: any) => {
          const updatedQuantity = [...prevState.colors]; // Create a shallow copy of the color array           
          updatedQuantity[colorIndex] = { color: updatedQuantity[colorIndex].color, quantity: numericValue }; // Updates the value at the specified index            
          return { ...prevState, colors: updatedQuantity };// Return the updated state with the modified color array
        });
      }
    } else { // All other inputs    
      // if it's not a checkbox or color then update the fields 
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
      updatedColors.push({ color: "#000000", quantity: 0 });
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
  // Handle product images Delete 
  const handleDeleteClick = (imagePub_id: string) => {
    // Store the product ID of image
    setSelectedId(imagePub_id);
    // set to True to show delete popup.
    setShowDeletePopup(true);
  };
  // handle Delete a product image
  const confirmDelete = async () => {
    // if no ID is stored/selected
    if (!selectedId) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagePubID: selectedId }),
    });
    // Set to fasle to hide delete popup.
    setShowDeletePopup(false);
    // Remove/clear the ID.
    setSelectedId(null);
    if (!res.ok) {
      console.error("Failed to delete");
      return;
    }
  };

  // Function to handle submission
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await putData(editForm as Products); // (as Products): means interface of mongoose Products model
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Handle function. Sending data to api/products/[id].ts
  const putData = async (editForm: Products) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
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
      // rerouter to home page
      router.push('/');
    } catch (error) {
      setMessage("Failed to update Product.");
    }
  };
  // Handle displaying hidden product images.
  const displayImages = (e: React.MouseEvent<SVGElement | HTMLDivElement>) => {
    setIsHiddenImages(prev => !prev);
  }

  return (
    <>
      <div className=" relative top-[40px] md:top-0 md:top-0  border-t md:border-none pt-4 ">
        <div className="w-[90%] md:w-[60%] mx-auto ">
          <h1 className="text-xl font-semibold text-center">Edit Product</h1>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-3">
            <div className="flex items-center">
              <label htmlFor="productName" className="w-28">Name:</label>
              <input type="text" id="productName" name="productName" className="border flex-1 pl-2" defaultValue={product.productName} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="price" className="w-28">Price:</label>
              <input type="number" id="price" name="price" className="border flex-1 pl-2" defaultValue={product.price} onChange={handleChange} required />
            </div>
            <div className="flex items-start ">
              <label htmlFor="productImg" className="w-28">Images:</label>
              <div className="   flex-1    flex flex-col    border rounded-[10px]" >
                <div className="  order-1 flex-auto flex items-center cursor-pointer h-7 rounded-[10px]" onClick={(e) => displayImages(e)}>
                  <div className="chevron-down mx-auto chevron-down90Deg"></div>
                </div>
                <ul className={`${isHiddenImages ? 'hidden' : " "}  order-2 border-t flex flex-wrap gap-2 p-1`}>
                  {productEditImages.map((image, index) => (
                    <li key={index} className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                      <img src={image.imageURL} alt="" />
                      <div className="w-4 h-4  relative top-[-38px] left-[-15px]" onClick={() => handleDeleteClick(image.imagePub_id)}>
                        <div key={index} className="close-icon" title="Delete Image" >
                          <div className="tooltip-text">Delete</div>
                        </div>
                      </div>

                    </li>
                  ))}

                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                  <li className="h-24 w-24 border rounded-[10px] mx-auto overflow-hidden flex items-center">
                    <img src='https://n.nordstrommedia.com/it/1b64d345-fd65-4db9-a635-b966b30e9497.jpeg?h=368&w=240&dpr=2' alt="" />
                    <div className="w-4 h-4 border relative top-[-38px] left-[-15px]" >
                      <div className="close-icon" title="Delete Image" >
                        <div className="tooltip-text">Delete</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="category" className="w-28">Category:</label>
              <select name="category" id="category" className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" defaultValue={product.category}  >
                <option key={0} value={product.category}>{product.category.slice(1)}</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="brand" className="w-28">Brand:</label>
              <input type="text" id="brand" name="brand" className="border flex-1 pl-2" defaultValue={product.brand} onChange={handleChange} required />
            </div>
            <div className="flex items-center">
              <label htmlFor="gender" className="w-28">Gender:</label>
              <select name="gender" id="gender" className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" defaultValue={product.gender}    >
                <option key={0} value={product.gender}>{product.gender}</option>
              </select>
            </div>
            <div className="flex items-start">
              <label htmlFor="color" className="w-28 pt-2">Colors:</label>
              <div className="flex-1 border rounded-[10px] p-2" id="color">
                {editForm.colors.map((elem, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input type="color" name="color" className="border" value={elem.color} onChange={(e) => handleChange(e, index)} />
                    <input type="number" name="quantity" className='border rounded-lg w-12 pl-1' value={elem.quantity === 0 ? '' : elem.quantity} onChange={(e) => handleChange(e, index)} required />
                    <button type="button" className="  rounded-lg py-[3px]  px-2 bg-red-600 text-white" onClick={() => deleteColor(index)}>Delete</button>
                  </div>
                ))}
                <button type="button" className="btn bg-cyan-600 text-white mt-2.5 border-none mx-auto" onClick={addMoreColor}>Add More Color</button>
              </div>
            </div>
            <div className="flex items-start">
              <label htmlFor="sizes" className="w-28">Select Sizes:</label>
              <div className='flex-1 flex flex-wrap items-center gap-4 border rounded-[10px] p-2' id="sizes">
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
              <select name="inStock" id="inStock" className="border rounded-lg flex-1 pl-2 bg-white h-[30px]" defaultValue={String(product.inStock)} onChange={handleChange} required  >
                <option value="" >choose one</option>
                <option value="true" >True </option>
                <option value="false">False</option>
              </select>
            </div>
            <button type="submit" className="btn bg-slate-700 text-white border-none w-1/2 mx-auto "> Edit Product</button>
          </form>

        </div >
      </div >
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-4 rounded  w-full max-w-sm">
            <h2 className="font-bold text-base mb-2">Confirm Deletion</h2>
            <p className="mb-4 text-sm">Are you sure you want to delete this image?</p>
            <div className="flex justify-end space-x-3 h-8">
              <button onClick={() => setShowDeletePopup(false)} className="px-3 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-3  bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
};

export default editProduct;