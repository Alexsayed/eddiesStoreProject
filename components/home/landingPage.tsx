import dbConnect from "../../lib/dbConnect";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import Link from "next/link";
import { BsPen, BsTrash } from "react-icons/bs";
// import Product, { Products } from "../../models/products";
import { Products } from "../../models/products";
import { useSession } from 'next-auth/react';

type Props = {
  // editFormId: string;
  getAllProducts: Products[],
  // searchQuery: string,
  // getAllProducts: string[];
  // forNewProduct?: boolean;

};
// next up: global sort function, by Date, price, A - Z, Z - A
// next up: dropdown menu.
// Handle home page
const HomePage = ({ getAllProducts, }: Props) => {
  // const { data: Session1, status } = useSession();
  const { data, status } = useSession();
  console.log('===============================,status landing', status)
  // console.log('===============================,session landing', update)
  console.log('===============================,data landing', data)

  // console.log('=========getAllProducts HomePage', getAllProducts[0].sizes.menSizes.jackets);
  // console.log('=========getAllProducts HomePage', getAllProducts);
  // console.log('=========searchQuery HomePage', typeof searchQuery.toLocaleLowerCase());
  // console.log('=========searchQuery HomePage lenght', searchQuery.length);
  // let filteredResults: Products[] = [];
  // if (searchQuery.length !== 0) {

  //   filteredResults = getAllProducts.filter(item => item.productName.toLowerCase().includes(searchQuery.toLocaleLowerCase()));
  //   // console.log('========= if searchQuery HomePage', filteredResults);
  // } else {
  //   // console.log('========= Else searchQuery HomePage', filteredResults);

  // }
  // const filteredResults = getAllProducts.filter(item => item.productName.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

  // console.log('=========filteredResults HomePage', filteredResults);

  // for (let i = 0; i < getAllProducts.length; i++) {
  //   console.log('=========getAllProducts HomePage', getAllProducts[i]);

  // }
  // // =======================================Original ============================================
  // const [products, setProduct] = useState<any>([]);

  // useEffect(() => {

  //   const fetchData = async () => {
  //     const response = await fetch('http://localhost:3000/api/products');
  //     // console.log('=============response', response)
  //     const json = await response.json();
  //     // console.log('=============json', json)

  //     setProduct(json.data);
  //   };
  //   fetchData();
  // }, []);
  // // =======================================Original ============================================


  return (

    <>
      <div className="border w-full">
        <ul className="text-center">
          {/* {filteredResults.length === 0 ? ( */}
          {getAllProducts.map((item: any, i: any) => (
            <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
              {status === 'authenticated' && (
                <div className="relative w-0 h-0 float-right">
                  <Link href={item._id + '/edit'}>
                    <div className="inline-block absolute right-1/4"> <BsPen /></div>
                  </Link>
                  {/* <div className="inline-block absolute  right-2/4"> <BsTrash /></div> */}
                </div>
              )}
              <Link href={item._id}>
                <div className="h-56 w-full">
                  <img className=" h-56 w-full object-fill" src={item.productImg} />
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

          {/* ) : (
            filteredResults.map((SearchItem: any, searchIndex: any) => (
              <li key={searchIndex} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
                <div className="relative w-0 h-0 float-right">
                  <div className="inline-block absolute right-1/4"> <BsPen /></div>
                  <div className="inline-block absolute  right-2/4"> <BsTrash /></div>
                </div>
                <Link href={SearchItem._id}>
                  <div className="h-56 w-full">
                    <img className=" h-56 w-full object-fill" src={SearchItem.productImg} />
                  </div>
                  <div className="mt-1">
                    <p>{SearchItem.productName}</p>
                  </div>
                  <div className="mx-2 block  text-start  ">
                    <div className="inline">
                      <span>${SearchItem.price}</span>
                    </div>
                    <div className="inline float-right">
                      <span className="text-emerald-600">In stock: {SearchItem.inStock}</span>
                    </div>
                  </div>
                </Link>
              </li>

            ))
          )} */}
        </ul>
      </div >
    </>

    //   filteredResults.length === 0 ? (
    //   <>
    //     <p>ddd</p>


    //     <div className="border w-full"> ahhah
    //       <ul className="text-center">xaxa

    //         <input type="text" value={searchQuery} disabled />
    //         <button className="btn">Search</button>
    //         <p>
    //           {getAllProducts.length ? 'xoxoxoxo' : 'hahaha ✅'}
    //         </p>
    //         {filteredResults.length === 0 ? (

    //           <>
    //             <p>No search results</p>

    //             {getAllProducts.map((item: any, i: any) => (
    //               <div>{item.productName}</div>
    //             ))}
    //           </>

    //         ) : (
    //           <p>filteredResults: {filteredResults[0].productName}</p>
    //         )}
    //         {getAllProducts.map((item: any, i: any) => (
    //           <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
    //             <span>{item.id}</span>

    //             <div className="relative w-0 h-0 float-right">
    //               <div className="inline-block absolute right-1/4"> <BsPen /></div>
    //               <div className="inline-block absolute  right-2/4"> <BsTrash /></div>
    //             </div>
    //             <Link href={item._id}>
    //               <div className="h-56 w-full">
    //                 <img className=" h-56 w-full object-fill" src={item.productImg} />
    //               </div>
    //               <div className="mt-1">
    //                 <p>{item.productName}</p>
    //               </div>
    //               <div className="mx-2 block  text-start  ">
    //                 <div className="inline">
    //                   <span>${item.price}</span>
    //                 </div>
    //                 <div className="inline float-right">
    //                   <span className="text-emerald-600">In stock: {item.inStock}</span>
    //                 </div>
    //               </div>
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   </>
    // ) : (
    //   <>
    //     <p>filteredResults: {filteredResults[0].productName}</p>
    //     {filteredResults.map((searchItem: any, searchIndex: any) => (
    //       <li key={searchIndex} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
    //         <span>{searchItem.id}</span>

    //         <div className="relative w-0 h-0 float-right">
    //           <div className="inline-block absolute right-1/4"> <BsPen /></div>
    //           <div className="inline-block absolute  right-2/4"> <BsTrash /></div>
    //         </div>
    //         <Link href={searchItem._id}>
    //           <div className="h-56 w-full">
    //             <img className=" h-56 w-full object-fill" src={searchItem.productImg} />
    //           </div>
    //           <div className="mt-1">
    //             <p>{searchItem.productName}</p>
    //           </div>
    //           <div className="mx-2 block  text-start  ">
    //             <div className="inline">
    //               <span>${searchItem.price}</span>
    //             </div>
    //             <div className="inline float-right">
    //               <span className="text-emerald-600">In stock: {searchItem.inStock}</span>
    //             </div>
    //           </div>
    //         </Link>
    //       </li>
    //     ))}

    //   </>
    // )


  )
}


export default HomePage;

{/* <>
  <div className="border w-full"> ahhah
          <ul className="text-center">xaxa

            <input type="text" value={searchQuery} disabled />
            <button className="btn">Search</button>
            <p>
              {getAllProducts.length ? 'xoxoxoxo' : 'hahaha ✅'}
            </p>
            {filteredResults.length === 0 ? (

              <>
                <p>No search results</p>

                {getAllProducts.map((item: any, i: any) => (
                  <div>{item.productName}</div>
                ))}
              </>

            ) : (
              <p>filteredResults: {filteredResults[0].productName}</p>
            )}
            {getAllProducts.map((item: any, i: any) => (
              <li key={i} className="border h-72 m-1.5 inline-block rounded-lg sm:w-2/5 md:w-1/4 lg:w-1/5 truncate" >
                <span>{item.id}</span>

                <div className="relative w-0 h-0 float-right">
                  <div className="inline-block absolute right-1/4"> <BsPen /></div>
                  <div className="inline-block absolute  right-2/4"> <BsTrash /></div>
                </div>
                <Link href={item._id}>
                  <div className="h-56 w-full">
                    <img className=" h-56 w-full object-fill" src={item.productImg} />
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
        </div>
        </> */}