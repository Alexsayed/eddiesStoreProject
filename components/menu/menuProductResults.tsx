import { useState, useEffect } from "react";
import Link from "next/link";
import Product, { Products } from "../../models/products";
import { sortProducts, SortOption } from "../../utils/sortProducts";
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
  console.log('================queryName from menuPResualt', queryName)
  // set seleted option
  // const [selectedSortOption, setSelectSortOption] = useState('');
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  // setting the sorted/mutated product data.
  const [sortedProductData, setSortedProductData] = useState<Products[]>(menuProductData);
  // handle sort options
  useEffect(() => {
    // OnChange event we would select a sort value, pass it to /utils/sortProducts file. sortProducts file we would execute sort function.
    // HOW IT WORKS: we will send all product data (menuProductData) and sort option (selectedSortOption),sortProducts function will preform sort and will return the sorted data back.
    const sorted = sortProducts(menuProductData, selectedSortOption);
    // Setting the sorted data 
    setSortedProductData(sorted);
  }, [selectedSortOption, menuProductData]);
  // // =========================on hold =========================================
  // useEffect(() => {
  //   // Sorting logic based on selected sort option
  //   const sortedData = [...menuProductData]; // Create a copy of the product data to avoid direct mutation
  //   switch (selectedSortOption) {
  //     case 'priceAscending':
  //       sortedData.sort((a, b) => a.price - b.price);
  //       break;
  //     case 'priceDescending':
  //       sortedData.sort((a, b) => b.price - a.price);
  //       break;
  //     case 'newest':
  //       sortedData.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  //       break;
  //     case 'nameAscending':
  //       sortedData.sort((a, b) => a.productName.localeCompare(b.productName));
  //       break;
  //     case 'nameDescending':
  //       sortedData.sort((a, b) => b.productName.localeCompare(a.productName));
  //       break;
  //     default:
  //       setSortedProductData(menuProductData); // Fallback to unsorted or default list
  //       return;
  //   }
  //   setSortedProductData(sortedData);
  // }, [selectedSortOption, menuProductData]);
  // // =========================on hold =========================================

  // handle sort changes.
  // HOW IT WORKS: we are setting the (setSelectSortOption) and then the data will be sort with userEffect() method.
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setSelectSortOption(e.target.value);
    setSelectSortOption(e.target.value as SortOption);
  };
  return (
    <>
      <div className="border h-12 py-2.5 ">
        <div className="inline mx-4">{formatqueryName(queryName)}</div>
        <div className="inline mx-4">{menuProductData.length} Products</div>
        <div className="text-right inline-block float-right mx-4">
          <label htmlFor="sort" className="m-0 inline-flex tracking-wider">Sort:</label>
          <select name="sort" id="sort" className="border " value={selectedSortOption} onChange={handleSortChange}>
            <option value="default">Featured</option>
            <option value="priceAscending">Price: Low to High</option>
            <option value="priceDescending">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="nameAscending">A-Z</option>
            <option value="nameDescending">Z-A</option>
          </select>

        </div>

      </div>
      <div className="border w-full">
        <ul className="text-center">
          {sortedProductData.map((product, i) => (
            <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
              <Link href={'../' + product._id}>
                <div className="h-56 w-full">
                  <img className=" h-56 w-full object-fill" src={product.productImg[0]} />
                </div>
                <div className="mt-1">
                  <p>{product.productName}</p>
                </div>
                <div className="mx-2 block  text-start  ">
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
    </>
  )
}
export default MenuProductResults;