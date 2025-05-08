import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import Product, { Products } from "../../models/products";
import { Products } from "../../models/products";
import { useSession } from 'next-auth/react';
import { globalMenCategories, globalWomenCategories } from '../postProduct/postProduct'

type Props = {
  menuData: string
}
const globalBrands = ['any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha', '7hahahha', '8hahahha', '9hahahha'];
// const globalBrands = ['any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters', '1hahahha', '2hahahha', '3hahahha', '4hahahha', '5hahahha', '6hahahha',];
const MenuBar = ({ menuData }: Props) => {
  // const [productBrands, setProductBrands] = useState<Products[]>([]);
  const [productBrands, setProductBrands] = useState<string[]>([]);
  const contentType = "application/json";
  // A Set automatically ignores duplicates, so a value in the set may only occur once; 
  // const seen = new Set<string>();
  const findDuplicate = new Set<string>();
  console.log('===============menuData', menuData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products', {
          method: 'GET',
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
        });
        const data = await res.json();
        const dataAsString = JSON.parse(JSON.stringify(data));
        dataAsString.data.map((elem: { brand: string }, index: number) => {
          const lower = elem.brand.toLowerCase();
          // we check to see whether we've already encountered the string
          if (!findDuplicate.has(lower)) {
            // We're adding the lowercased version of the elem.brand string to the set.
            findDuplicate.add(lower);
            // adding only values that are unique. So we won't have duplicated value
            setProductBrands(prev => [...prev, elem.brand])
          }
        })
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchData();
  }, []);
  // In case our brand array get larger then 8 elements, we would split then in to two arraies. 
  // firstColumn takes from 0 to 8 elements 
  const firstColumn = productBrands.slice(0, 8);
  // secondColumn takes elements from 8 to 15. its 15 so if the productBrands is more than 16 elements, we are not display all of them.
  const secondColumn = productBrands.length > 8 ? productBrands.slice(8, 15) : [];
  continue styling. menu bar is done on large View port
  return (
    <>
      <div className=" p-2 h-10 border-b">
        {/* <nav className="h-12 border"> */}

        <ul className="flex ">
          <li className="inline ml-4 mr-16 w-20"><Link href={'/'}>Home</Link></li>
          <li className="inline mr-16 w-14 hover:border-t-2 border-slate-400"><Link href={'/menu/newItems'}>New In</Link></li>
          <li className="inline mr-16 group  w-12 hover:border-t-2 border-slate-400">
            <span className="">Men's</span>
            {/* <ul className="hidden group-hover:block group-hover:relative bg-slate-200"> */}
            <ul className="hidden group-hover:block group-hover:relative bg-white w-48  z-10 top-1.5 p-2 border rounded ">
              <p className="font-bold text-lg mb-2">Shop by Category</p>
              {globalMenCategories.map((elem, index) => (
                <li key={index} className="m-1 hover:text-slate-400">
                  <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="inline mr-16 group  w-16  border-slate-400 ">
            <span>Women's</span>
            <ul className="hidden group-hover:block group-hover:relative  bg-white w-48 z-10 top-1.5 p-2 border rounded">
              <p className="font-bold text-lg mb-2">Shop by Category</p>
              {globalWomenCategories.map((elem, index) => (
                <li key={index} className="m-1 hover:text-slate-400">
                  <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="inline mr-16 group  w-12 hover:border-t-2 border-slate-400">
            <span>Brands</span>
            {/* <ul className=" group-hover:block group-hover:relative bg-white w-48  z-10 top-1.5 p-2 border rounded relative">
              <p className="font-bold text-lg mb-2">Shop by Brand</p>
              {globalBrands.map((elem, index) => (
                <li key={index} className="  m-1 hover:text-slate-400">
                  <Link href={'/menu/' + elem}>M {elem}
                  </Link>
                </li>
              ))}
            </ul> */}
            <div className={`hidden group-hover:block group-hover:relative flex-col bg-white ${secondColumn.length > 0 ? 'w-96' : 'w-48'} relative z-10 top-1.5 p-2 border rounded `} >
              <p className="font-bold text-lg mb-2">Shop by Brand</p>
              <div className="flex gap-4">
                <ul>
                  {firstColumn.map((elem, index) => (
                    <li key={index} className="m-1 hover:text-slate-400">
                      <Link href={`/menu/${elem}`}>{elem}</Link>
                    </li>
                  ))}
                </ul>
                {secondColumn.length > 0 && (
                  <ul>
                    {secondColumn.map((elem, index) => (
                      <li key={index} className="m-1 hover:text-slate-400">
                        <Link href={`/menu/${elem}`}>S:{elem}</Link>
                      </li>
                    ))}
                    {globalBrands.length > 15 && (
                      <li className="m-1 hover:text-slate-400" >More Brands...</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
      {/* </nav> */}
    </>
  )

}
export default MenuBar;