import { createContext, useState } from "react";
import { GetServerSidePropsContext } from "next";
import React from 'react';
// import { GetServerSideProps, GetServerSidePropsContext } from "next";
import dbConnect from "../../lib/dbConnect";
import Link from "next/link";
import Product, { Products } from "../../models/products";
// import { globalMenCategories, globalWomenCategories } from '../../components/postProduct/postProduct';
import { ParsedUrlQuery } from "querystring";
import MenuProductResults from "../../components/menu/menuProductResults";
interface Params extends ParsedUrlQuery {
  // We call it slug bc the file name is [slug].tsx
  slug: string;
}
type Props = {
  menuResults: Products[];
  slugName: string;
};
// Helper function to format the slug into the category format.
const formatSlug = (slug: string): string => {
  // slug = 'mtees', 'mjacket', 'mshoes', wshoes etc...     
  // we need to convert slugs second letter or (index 1) to uppercase so it can match category values. Example: category = 'mTees', 'mJacket', 'mShoes', wShoes etc... 
  return slug.charAt(0) + slug.charAt(1).toUpperCase() + slug.slice(2);
};
const menuRoutes = ({ menuResults, slugName }: Props) => {
  return (
    < MenuProductResults menuProductData={menuResults} queryName={slugName} />
  )
};
// Get data from db.
export async function getServerSideProps(context: GetServerSidePropsContext) {
  await dbConnect();
  const { slug } = context.params as Params;
  let productResults: Products[] = [];
  if (!slug) {
    return {
      notFound: true,
    };
  }
  // if we want get newest posted products
  if (slug === 'newItems') {
    // Getting current data again
    const thirtyDaysAgo = new Date();
    // setDate: changes the day of the month for this date according to local time.
    // HOW IT WORKS: thirtyDaysAgo = today's data.setDate(today's date - 30 days), so if today is 03/25/2025, the result will be 02/25/2025
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    productResults = await Product.find({
      created: { $gte: thirtyDaysAgo }
    })
      // Descending/newest first sort
      .sort({ created: -1 });
    // if it starts with 'm' it mean we are looking for men categories
  } else if (slug.startsWith('m')) {
    const modifiedSlug = formatSlug(slug);
    productResults = await Product.find({ gender: "Men", category: modifiedSlug });
    // if it starts with 'w' it mean we are looking for women categories
  } else if (slug.startsWith('w')) {
    const modifiedSlug = formatSlug(slug);
    productResults = await Product.find({ gender: "Women", category: modifiedSlug });
    // looking by Brand name.
  } else {
    productResults = await Product.find({ brand: slug });
  }
  // parses a JSON string data and then convert a JavaScript value to a JSON string. 
  const stringifyProduct = JSON.parse(JSON.stringify(productResults));
  return {
    props: {
      // assign stringifyProduct to menuResults.
      menuResults: stringifyProduct,
      slugName: slug
    },
  };
}
export default menuRoutes;