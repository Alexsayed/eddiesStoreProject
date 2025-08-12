import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Product, { Products } from "../models/products";
import Link from "next/link";
import { BsPen, BsTrash } from "react-icons/bs";
import { sortProducts, SortOption } from "../utils/sortProducts";
import { useSession } from 'next-auth/react';

// Handle in site Search
const SearchResults = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  // if router.query?.query is String then will remove any white space in the string
  const query = typeof router.query?.query === 'string' ? router.query.query.trim() : '';
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const [filteredResults, setFilteredResults] = useState<Products[]>([]); // Filtered results state
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  const [sortedResults, setSortedResults] = useState<Products[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // First we are getting all products DB.
  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        const response = await fetch('/api/products');
        const json = await response.json();
        setAllProducts(json.data);
      };
      fetchData();
    }
  }, [query]);
  // set the sort option back to "default" whenever we search for new items
  useEffect(() => {
    setSelectSortOption("default");
  }, [query]);

  // Filter in allProducts[] for matching Query (which is search value).
  useEffect(() => {
    // if search query is more then 3 letters and it's a string AND the allProducts has values
    if (query && query.length >= 3 && typeof query === 'string' && allProducts.length > 0) {
      try {
        // filter products by it's Name, Brand and Category and return filtered data.   
        const filtered = allProducts.filter(item =>
        // if product's name is matching our search/query
        (item.productName.toLowerCase().includes(query.toLowerCase()) ||
          // if product's Barnd is matching or search/query
          item.brand.toLowerCase().includes(query.toLowerCase()) ||
          // if Product's Category is matching search/query
          item.category.slice(1).toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredResults(filtered); // set filtered data
        setSortedResults(null); // reset sorted data
      } catch (error) {
        console.error('Error during filtering products:', error);
      }
    }
  }, [query, allProducts]); // Dependency array ensures this runs when query or allProducts changes

  useEffect(() => {
    if (selectedSortOption !== 'default') {
      const sorted = sortProducts(filteredResults, selectedSortOption);
      setSortedResults(sorted);
    } else {
      setSortedResults(null); // reset to default (unsorted)
    }
  }, [selectedSortOption, filteredResults]);

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
  // If sortedResults is NOT null or undefined, use it. Otherwise, use filteredResults.
  const displayResults = sortedResults ?? filteredResults;

  return (
    <>
      <div className="w-full  mt-10 md:mt-0 border-t md:border-none  ">
        <div className="  py-2 text-sm border-b">
          <p className="inline ml-3">{displayResults.length} Products</p>
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
        <div className="py-2  ">
          {displayResults.length === 0 && (
            <p className='text-center'>No Product found.</p>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center px-4">
            {displayResults.map((result, i) => (
              <li key={i} className="border h-72 w-full max-w-xs rounded-lg truncate" >
                {status === 'authenticated' && (
                  <div className="relative w-0 h-0 float-right ">
                    <div className="absolute bg-slate-50 rounded-full w-6 h-6 cursor-pointer text-indigo-500 right-1/4 flex items-center justify-center" >
                      <Link href={`../${result._id}/edit`} className="">
                        <BsPen />
                      </Link>
                    </div>
                    <div className="absolute bg-slate-50 rounded-full w-6 h-6  mr-2 cursor-pointer text-red-500 flex items-center justify-center right-[24px]" onClick={() => handleDeleteClick(result._id)}>
                      <BsTrash />
                    </div>
                  </div>
                )}
                <Link href={result._id}>
                  <div className="h-4/5 w-full aspect-[4/3] overflow-hidden">
                    <img className="w-full h-full object-cover" src={result.productImg[0].imageURL} />
                  </div>
                  <div className="mt-1 mx-2">
                    <p>{result.productName}</p>
                  </div>
                  <div className="mx-2 block text-start">
                    <div className="inline">
                      <span>${result.price}</span>
                    </div>
                    <div className="inline float-right">
                      <span className="text-emerald-600">In stock: {result.inStock}</span>
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
export default SearchResults;