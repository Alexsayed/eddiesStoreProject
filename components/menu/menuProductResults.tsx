import { useState, useEffect } from "react";
import Link from "next/link";
import Product, { Products } from "../../models/products";
import { sortProducts, SortOption } from "../../utils/sortProducts";
import { BsPen, BsTrash } from "react-icons/bs";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';

type Props = {
  menuProductData: Products[];
  queryName: string;
};
// Format category names.
const formatqueryName = (name: string) => {
  // if name starts with letter m, it means it's Men product and if it's starts with w, it mean Women product
  if (name.startsWith('m')) {
    // Lets say we have (name = mtees). 1. Below adding Men at the beginning of the string 2. converting t to upper case T.
    // 3. name.slice(2) gives the rest of the string starting from index 2 onward.
    // The final return value would be 'Men Tees' for the input 'mtees'.
    return 'Men ' + name.charAt(1).toUpperCase() + name.slice(2);
  } else if (name.startsWith('w')) {
    return 'Women ' + name.charAt(1).toUpperCase() + name.slice(2);
  } else if (name === 'newItems') {
    return 'New Arrival';
  } else {
    return name;
  }
};
const MenuProductResults = ({ menuProductData, queryName }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [selectedSortOption, setSelectSortOption] = useState('');
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  // setting the sorted/mutated product data.
  const [sortedProductData, setSortedProductData] = useState<Products[]>(menuProductData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // handle sort options
  useEffect(() => {
    // OnChange event we would select a sort value, pass it to /utils/sortProducts file. sortProducts file we would execute sort function.
    // HOW IT WORKS: we will send all product data (menuProductData) and sort option (selectedSortOption),sortProducts function will preform sort and will return the sorted data back.
    const sorted = sortProducts(menuProductData, selectedSortOption);
    // Setting the sorted data 
    setSortedProductData(sorted);
  }, [selectedSortOption, menuProductData]);

  // handle sort changes.
  // HOW IT WORKS: we are setting the (setSelectSortOption) and then the data will be sort with userEffect() method.
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    // if now ID is stored/selected
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
    router.push('../');
  };

  return (
    <>
      <div className="w-full relative top-[40px] md:top-0 border-t md:border-none">
        <div className="  py-2 text-sm border-b">
          <p className="inline ml-3">{formatqueryName(queryName)}</p>
          <p className="inline ml-3">{menuProductData.length} Products</p>
          <div className="text-right inline-block float-right mx-4 ">
            <label htmlFor="sort" className="m-0 inline">Sort:</label>
            <select name="sort" id="sort" className="border w-24 rounded-md bg-white  pl-0.5 ml-1" value={selectedSortOption} onChange={handleSortChange}>
              <option value="default">Featured</option>
              <option value="priceAscending">Price: Low to High</option>
              <option value="priceDescending">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="nameAscending">A-Z</option>
              <option value="nameDescending">Z-A</option>
            </select>
          </div>
        </div>
        <div className="pt-2">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center px-4">
            {sortedProductData.map((product, i) => (
              <li key={i} className="border h-72 w-full max-w-xs rounded-lg truncate" >
                {status === 'authenticated' && (
                  <div className="relative w-0 h-0 float-right ">
                    <div className="absolute bg-slate-50 rounded-full w-6 h-6 cursor-pointer text-indigo-500 right-1/4 flex items-center justify-center" >
                      <Link href={`../${product._id}/edit`} className="">
                        <BsPen />
                      </Link>
                    </div>
                    <div className="absolute bg-slate-50 rounded-full w-6 h-6  mr-2 cursor-pointer text-red-500 flex items-center justify-center right-[24px]" onClick={() => handleDeleteClick(product._id)}>
                      <BsTrash />
                    </div>
                  </div>
                )}
                <Link href={'../' + product._id}>
                  <div className="h-4/5 w-full aspect-[4/3] overflow-hidden">
                    <img className="w-full h-full object-cover" src={product.productImg[0]} alt={product.productName[1]} />
                  </div>
                  <div className="mt-1 mx-2">
                    <p>{product.productName}</p>
                  </div>
                  <div className="mx-2 block text-start  ">
                    <div className="inline">
                      <span>${product.price}</span>
                    </div>
                    <div className="inline float-right">
                      <span className="text-emerald-600">In stock: {product.inStock}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
export default MenuProductResults;