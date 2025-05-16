import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Product, { Products } from "../models/products";
import Link from "next/link";
import { BsPen, BsTrash } from "react-icons/bs";
// Handle in site Search
const SearchResults = () => {
  const router = useRouter();
  // const { query } = router.query; // Access the query parameter from the URL
  // const { query } = router.query?.query?.trim() || ''; // If `query` is undefined, default to an empty string
  const query = typeof router.query?.query === 'string'
    ? router.query.query.trim() // If it's a string, call trim()
    : '';
  // const query = typeof router.query?.query === 'string'
  //   ? decodeURIComponent(router.query.query).trim() // If it's a string, call trim()
  //   : '';
  const [results, setResults] = useState<Products[]>([]); // Assume results are an array of strings
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const [filteredResults, setFilteredResults] = useState<Products[]>([]); // Filtered results state
  console.log('===========query', query)


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
  // next uppp: admin
  // Filter in allProducts[] for matching Query (which is search value).
  useEffect(() => {
    // Filter the results whenever 'allProducts' or 'query' changes
    if (query && query.length >= 3 && typeof query === 'string' && allProducts.length > 0) {
      try {
        // alert(query)
        // filter products by it's Name, Brand and Category and return (filtered).   
        const filtered = allProducts.filter(item =>
        (item.productName.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase()) ||
          item.category.slice(1).toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredResults(filtered);
      } catch (error) {
        console.error('Error during filtering products:', error);
      }
    }
  }, [query, allProducts]); // Dependency array ensures this runs when query or allProducts changes
  // next upp: make the search broader like seaching by category or brand etc...
  return (
    <div className="border w-full">
      {filteredResults.length > 0 ? (
        <ul className="text-center">
          {filteredResults.map((result, i) => (
            // <li key={index}>ID:{result._id}</li>
            <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
              <div className="relative w-0 h-0 float-right">
                <div className="inline-block absolute right-1/4"> <BsPen /></div>
                <div className="inline-block absolute  right-2/4"> <BsTrash /></div>
              </div>
              <Link href={result._id}>
                <div className="h-56 w-full">
                  <img className=" h-56 w-full object-fill" src={result.productImg} />
                </div>
                <div className="mt-1">
                  <p>{result.productName}</p>
                </div>
                <div className="mx-2 block  text-start  ">
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
      ) : (
        <p>No results found</p>

      )}
    </div>
  )
}
export default SearchResults;