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
const globalBrands = ['any', 'H&M', 'Zara', 'Topshop', 'Paragon', 'Nike', 'Puma', 'Urban Outfitters'];
const MenuBar = ({ menuData }: Props) => {
  console.log('====globalMenCategories', globalMenCategories)
  return (
    <>
      {/* <div className="h-12"> */}
      <nav className="h-12 border">
        <ul className="flex ">
          <li className="inline ml-4 mr-16 w-20"><Link href={'/'}>Home</Link></li>
          <li className="inline mr-16 w-20"><Link href={'/menu/newItems'}>New In</Link></li>
          <li className="inline mr-16 group  w-20">
            <span>Men's</span>
            <ul className="hidden group-hover:block group-hover:relative ">
              {globalMenCategories.map((elem, index) => (
                <li key={index}>
                  <Link href={'/menu/' + 'm' + elem.toLowerCase()}> {elem}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="inline mr-16 group w-20">
            <span>Women's</span>
            <ul className="hidden group-hover:block group-hover:relative">
              {globalWomenCategories.map((elem, index) => (
                <li key={index}>
                  <Link href={'/menu/' + 'w' + elem.toLowerCase()}> {elem}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="inline mr-16 group w-20">
            <span>Brands</span>
            <ul className="hidden group-hover:block group-hover:relative">
              {globalBrands.map((elem, index) => (
                <li key={index}>
                  <Link href={'/menu/' + elem}> {elem}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        {/* </div> */}
      </nav>
    </>
  )

}
export default MenuBar;