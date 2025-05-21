import dbConnect from "../../lib/dbConnect";
import { useState, useEffect } from "react";
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
// next up: start css
// Handle home page
const HomePage = ({ getAllProducts, }: Props) => {
  const contentType = "application/json";
  const router = useRouter();
  // const { data: Session1, status } = useSession();
  const { data, status } = useSession();
  // console.log('=======data for useSession', data)
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  const [sortedProductData, setSortedProductData] = useState<Products[]>(getAllProducts);
  const [productsData, setProductsData] = useState<Products[]>(getAllProducts);
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

  // handle Delete a product
  const deletePost = async (id: string) => {
    const res = await fetch('/api/products/' + id, {
      method: "DELETE",
      headers: {
        Accept: contentType,
        "Content-Type": contentType,
      },
      body: JSON.stringify({ id: id }),
    });
    if (!res.ok) {
      throw new Error(res.status.toString());
    }
    router.push('/');
  }
  next up: work on this page
  return (

    <>
      <div className="float-right mx-4 my-2 h-7 ">
        <label htmlFor="sort" className="m-0 inline ">Sort:</label>
        <select name="sort" id="sort" className="border w-24 rounded-md bg-white pl-0.5 ml-1 place-content-center" value={selectedSortOption} onChange={handleSortChange}>
          <option value="default">Featured</option>
          <option value="priceAscending">Price: Low to High</option>
          <option value="priceDescending">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="nameAscending">A-Z</option>
          <option value="nameDescending">Z-A</option>
        </select>
      </div>
      <div className="border w-full inline-block">
        <ul className="text-center">
          {productsData.map((item: any, i: any) => (
            <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
              {status === 'authenticated' && (
                <div className="relative w-0 h-0 float-right ">
                  <Link href={item._id + '/edit'}>
                    <div className="inline-block absolute right-1/4 bg-lime-500 rounded-full w-6 h-6 justify-items-center content-evenly "> <BsPen /></div>
                  </Link>
                  {/* <div className="inline-block absolute  right-2/4"> <BsTrash /></div> */}
                  <div className="inline-block absolute  bg-lime-500 rounded-full w-6 h-6 justify-items-center content-evenly mr-2 cursor-pointer text-red-500" style={{ right: '24px' }} onClick={() => deletePost(item._id)}> <BsTrash /></div>
                </div>
              )}
              <Link href={item._id}>
                <div className="h-56 w-full">
                  <img className=" h-56 w-full object-scale-down" src={item.productImg} />
                </div>
                <div className="mt-1">
                  <p>{item.productName}</p>
                </div>
                <div className="mx-2 block  text-start  ">
                  <div className="inline">
                    <span>${item.price}</span>
                  </div>
                  <div className="inline float-right">
                    <span className="text-emerald-600">In stock: {item.inStock}</span>
                  </div>
                </div>
              </Link>

            </li>
          ))}
        </ul>

      </div >
    </>
  )
}

export default HomePage;