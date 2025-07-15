import EditForm from "../../components/editProduct/editForm";
import React from 'react';
import dbConnect from "../../lib/dbConnect";
import Product, { Products } from "../../models/products";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import Size from '../../models/sizes';
import { getSession } from 'next-auth/react';
// This interface represents a typed version of URL query parameters, where you're specifically expecting an id parameter to always be present and to always be a string.
interface Params extends ParsedUrlQuery {
  id: string;
}
type Props = {
  getProduct: Products;
};

// Handle editing a product
const EditProduct = ({ getProduct }: Props) => {
  return (
    // Pass the data(getProducts) to components/editproduct/EditForm, which it has a fuction with 1 arg ( function editProduct({ product }) )      
    <EditForm product={getProduct} />
  )
};
// Handle user authentication and and find selected product by it's ID from DB.
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Step 1: Get the session to check if the user is authenticated
  const session = await getSession(context);
  // Step 2: If no session, redirect the user to the signin page
  if (!session) {
    // what encodeURIComponent does: It converts characters that are not allowed or have special meaning in a URL (such as :, /, &, =, ?, etc.) into their percent-encoded form.
    const callbackUrl = encodeURIComponent(context.resolvedUrl);
    // Redirect to signin page
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }
  // Step 3: Connect to the database
  await dbConnect();
  const { id } = context.params!;
  // Find the product
  const productResult = await Product.findById({ _id: id });
  if (!productResult) {
    return {
      notFound: true,
    };
  } else {
    // find the Gender of the product
    const sizeField = productResult.gender === 'Women' ? 'womenSizes' : 'menSizes';
    // Populate product sizes
    await productResult.populate({ path: 'sizes', model: Size, select: sizeField });
    const stringifyProduct = JSON.parse(JSON.stringify(productResult));

    return {
      props: {
        // assign stringifyProduct to getProduct, which is defind at the top of our code. line: 27
        getProduct: stringifyProduct,
      },
    };
  }
}
export default EditProduct;
