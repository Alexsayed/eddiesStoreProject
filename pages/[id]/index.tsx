import { createContext, useState } from "react";
import { useRouter } from "next/router";
import ProductPage from "../../components/home/product";
import Navbar from "../../components/navbar/navbar";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import Product, { Products } from "../../models/products";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import Size from '../../models/sizes';
// This interface represents a typed version of URL query parameters, where you're specifically expecting an id parameter to always be present and to always be a string.
interface Params extends ParsedUrlQuery {
  id: string;
}
type Props = {
  getProduct: Products;
};
// Handle viewing a product 
const getProductPage = ({ getProduct, }: Props) => {
  const router = useRouter();
  const [message, setMessage] = useState('Hello, world!');

  return (
    < ProductPage productData={getProduct} />
  );
};


export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, }: GetServerSidePropsContext) => {
  await dbConnect();
  if (params) {
    // Access the property of params.ID; only if the params object is defined.
    params.id;
  } else {
    return {
      notFound: true,
    };
  }

  // Find product by it's ID
  const productResult = await Product.findById({ _id: params.id });
  if (!productResult) {
    return {
      notFound: true,
    };
  };
  // Selecting the Size field based on gender of the product.  
  const sizeField = productResult.gender === 'Women' ? 'womenSizes' : 'menSizes';
  // Populate the Size model.
  await productResult.populate({ path: 'sizes', model: Size, select: sizeField });
  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const stringifyProduct = JSON.parse(JSON.stringify(productResult));

  return {
    props: {
      getProduct: stringifyProduct,
    },
  };
};

export default getProductPage;

