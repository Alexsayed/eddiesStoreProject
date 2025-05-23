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

// Handle home page
const HomePage = ({ getAllProducts, }: Props) => {
  const contentType = "application/json";
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedSortOption, setSelectSortOption] = useState<SortOption>("default");
  // const [sortedProductData, setSortedProductData] = useState<Products[]>(getAllProducts);
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

  return (
    <>
      {/* <div className="float-right mx-4 my-2 h-7 inline "> */}
      <div className="w-full  flex justify-end px-4  py-1 sm:py-2 md:py-2 ">
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
      {/* <div className="border   pt-2 inline-block "> */}
      <div className="border  pt-2 ">
        {/* <ul className=" text-center mx-auto"> */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center px-4">
          {/* <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center"> */}
          {productsData.map((item: any, i: any) => (
            // <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
            <li key={i} className="border h-72 w-full max-w-xs rounded-lg truncate" >
              {/* {status === 'authenticated' && ( */}
              <div className="relative w-0 h-0 float-right ">
                <Link href={item._id + '/edit'}>
                  <div className="inline-block absolute right-1/4 bg-lime-500 rounded-full w-6 h-6 justify-items-center content-evenly "> <BsPen /></div>
                </Link>
                {/* <div className="inline-block absolute  right-2/4"> <BsTrash /></div> */}
                <div className="inline-block absolute  bg-lime-500 rounded-full w-6 h-6 justify-items-center content-evenly mr-2 cursor-pointer text-red-500" style={{ right: '24px' }} onClick={() => deletePost(item._id)}> <BsTrash /></div>
              </div>
              {/* )} */}
              <Link href={item._id}>
                {/* <div className="h-56 w-full"> */}
                <div className="h-4/5 w-full aspect-[4/3] overflow-hidden">

                  {/* <img className=" h-56 w-[98%] object-scale-down" src={item.productImg} /> */}
                  <img className="w-full h-full object-cover" src={item.productImg} alt={item.productName} />
                </div>
                <h1 className="text-2xl">Continue here tomorrow</h1>
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