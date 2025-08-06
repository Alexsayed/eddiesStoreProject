import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import dbConnect from "../lib/dbConnect";
import Product, { Products } from "../models/products";
import Size, { ISizes } from '../models/sizes';
import HomePage from "../components/home/landingPage";

interface Props {
  allProducts: Products[];
}

// Handle landing page
const Index = ({ allProducts }: Props) => {
  return (
    < HomePage getAllProducts={allProducts} />
  )
};

/* Retrieves products data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect();
  try {
    // To Populate mongoDB/mongoose model we HAVE TO populate it like below: populate({ path: 'sizes', model: Size }) otherwise won't work.
    const productsResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
    const stringifyAllProduct = JSON.parse(JSON.stringify(productsResult));
    return { props: { allProducts: stringifyAllProduct, } };
  } catch (err) {
    return { props: { allProducts: [], } };
  }
};

export default Index;
