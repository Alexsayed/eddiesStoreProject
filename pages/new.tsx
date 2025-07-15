import { NextApiRequest, NextApiResponse } from "next";
import { GetServerSidePropsContext } from "next";
import { getSession } from 'next-auth/react';
// import Product, { Products } from "../models/products";


// import Form from "../components/Form";
import PostProduct from "../components/postProduct/postProduct";
// import HomePage from "../components/home/landingPage";

// import { GetServerSideProps } from "next";
// type Props = {
//   data: any;
// };
type Props = {};

// const NewPet = ({ data }: Props) => {
const NewPet = ({ }: Props) => {
  // const data = {} as Products;
  // const data = {} as any;
  return (
    // // **********************WORKING ONE *******************
    // < PostProduct formId="add-pet-form" product={data} />
    // < PostProduct formId="add-pet-form" />
    < PostProduct />
    // < PostProduct formId="add-pet-form" />
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  console.log('=============================== session /new', session)
  if (!session) {
    console.log('=============================== context.resolvedUrl from new', context.resolvedUrl)

    const callbackUrl = encodeURIComponent(context.resolvedUrl);
    // const callbackUrl = context.resolvedUrl;
    console.log('=============================== callbackUrl /new', callbackUrl)

    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}

export default NewPet;
