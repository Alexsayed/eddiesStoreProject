import { createContext, useState } from "react";
import { GetServerSidePropsContext } from "next";
import React from 'react';
import dbConnect from "../../lib/dbConnect";
import Product, { Products } from "../../models/products";
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
  // Store product results 
  let productResults: Products[] = [];
  if (!slug) {
    return {
      notFound: true,
    };
  }

  if (slug === 'newItems') { // if we want to get newest products
    // Getting current data 
    const thirtyDaysAgo = new Date();
    // setDate: changes the day of the month for this date according to local time.
    // HOW IT WORKS: thirtyDaysAgo = today's data. data.setDate(today's date - 30 days), so if today is 03/25/2025, the result will be 02/25/2025
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // go back 30 days
    // find products that are new but not more than 30 days old. Sort: Descending/newest first sort
    productResults = await Product.find({ created: { $gte: thirtyDaysAgo } }).sort({ created: -1 });

  } else if (slug.startsWith('m')) { // if it starts with 'm' it mean we are looking for men categories
    const modifiedSlug = formatSlug(slug); // format the slug
    // find product where the gender is Men
    productResults = await Product.find({ gender: "Men", category: modifiedSlug });

  } else if (slug.startsWith('w')) { // if it starts with 'w' it mean we are looking for women categories
    const modifiedSlug = formatSlug(slug);
    // find product where the gender is Women
    productResults = await Product.find({ gender: "Women", category: modifiedSlug });

  } else { // looking by Brand name.
    // find product by it's Brand name
    productResults = await Product.find({ brand: slug });

  }
  // Parse and stringify  data 
  const stringifyProduct = JSON.parse(JSON.stringify(productResults));

  return {
    props: {
      // assign stringifyProduct to menuResults and slug to slugName.
      menuResults: stringifyProduct,
      slugName: slug
    },
  };
}
export default menuRoutes;