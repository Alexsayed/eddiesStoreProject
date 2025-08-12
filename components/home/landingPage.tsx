// import dbConnect from "../../lib/dbConnect";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import Link from "next/link";
import { BsPen, BsTrash } from "react-icons/bs";
import { Products } from "../../models/products";
import { useSession } from 'next-auth/react';
import { sortProducts, SortOption } from "../../utils/sortProducts"
type Props = {
  getAllProducts: Products[],
};

// Handle home page
const HomePage = ({ getAllProducts, }: Props) => {
  const contentType = "application/json";
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  // const [sortedProductData, setSortedProductData] = useState<Products[]>(getAllProducts);
  const [productsData, setProductsData] = useState<Products[]>(getAllProducts);
  // const [productsData, setProductsData] = useState<string[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // handle sort options
  useEffect(() => {
    // OnChange event we would select a sort value, pass it to /utils/sortProducts file. sortProducts file we would execute sort function and return sorted data back.
    const sorted = sortProducts(getAllProducts, selectedSortOption);
    // Setting the sorted data   
    setProductsData(sorted);
  }, [selectedSortOption, getAllProducts])
  // handle sort changes.
  // HOW IT WORKS: we are setting the (setSelectSortOption) and then the data will be sort with userEffect() method.
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setSelectSortOption(e.target.value);
    setSelectSortOption(e.target.value as SortOption);
  };
  // Initiate product Delete 
  const handleDeleteClick = (id: string) => {
    // Store the product ID
    setSelectedId(id);
    // set to True to show delete popup.
    setShowDeletePopup(true);
  };

  // handle Delete a product
  const confirmDelete = async () => {
    // if no ID is stored/selected
    if (!selectedId) return;
    const res = await fetch(`/api/products/${selectedId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedId }),
    });
    // Set to fasle to hide delete popup.
    setShowDeletePopup(false);
    // Remove/clear the ID.
    setSelectedId(null);
    if (!res.ok) {
      console.error("Failed to delete");
      return;
    }
    router.push('/');
  };

  return (
    <>
      <div className="w-full  flex justify-end px-4  py-1.5 border-b ">
        <div className="">
          <label htmlFor="sort" className="m-0 inline ">Sort:</label>
          <select name="sort" id="sort" className="border w-24 rounded-md bg-white pl-0.5 ml-1 " value={selectedSortOption} onChange={handleSortChange}>
            <option value="default">Featured</option>
            <option value="priceAscending">Price: Low to High</option>
            <option value="priceDescending">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="nameAscending">A-Z</option>
            <option value="nameDescending">Z-A</option>
          </select>
        </div>
      </div>
      <div className="  py-2  " >
        {productsData.length === 0 && (
          <p className=" text-center">No Product.</p>
        )}
        <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center px-4">
          {productsData.map((item: any, i: any) => (
            <li key={i} className=" border h-72 w-full max-w-xs rounded-lg truncate" >
              {status === 'authenticated' && (
                <div className="relative w-0 h-0 float-right ">
                  <div className="absolute bg-slate-50 rounded-full w-6 h-6 cursor-pointer text-indigo-500 right-1/4 flex items-center justify-center" >
                    <Link href={`${item._id}/edit`} className="">
                      <BsPen />
                    </Link>
                  </div>
                  <div className="absolute bg-slate-50 rounded-full w-6 h-6  mr-2 cursor-pointer text-red-500 flex items-center justify-center right-[24px]" onClick={() => handleDeleteClick(item._id)}>
                    <BsTrash />
                  </div>
                </div>
              )}
              <Link href={item._id}>
                <div className="h-4/5 w-full aspect-[4/3] overflow-hidden">
                  <img className="w-full h-full object-cover" src={item.productImg[0].imageURL} alt={item.productName[1].imageURL} />
                </div>
                <div className="mt-1 mx-2">
                  <p>{item.productName}</p>
                </div>
                <div className="mx-2 block  text-start  ">
                  <div className="inline">
                    <span>${item.price}</span>
                  </div>
                  <div className="inline float-right">
                    {item.inStock ? (
                      <span className="text-emerald-600 text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-500 text-sm">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div >
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-4 rounded  w-full max-w-sm">
            <h2 className="font-bold text-base mb-2">Confirm Deletion</h2>
            <p className="mb-4 text-sm">Are you sure you want to delete this product?</p>
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
}
export default HomePage;