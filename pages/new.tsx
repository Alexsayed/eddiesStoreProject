import { NextApiRequest, NextApiResponse } from "next";
import { GetServerSidePropsContext } from "next";
import { getSession } from 'next-auth/react';
import PostProduct from "../components/postProduct/postProduct";

type Props = {};

// Handle /new route/page 
const NewPet = ({ }: Props) => {
  return (
    < PostProduct />
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get sign in authentication 
  const session = await getSession(context);
  // if not signed in
  if (!session) {
    // get the URL we are intended to visit
    const callbackUrl = encodeURIComponent(context.resolvedUrl);
    // redirect to signin page and provide call back URL, in our case would be /new
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${callbackUrl}`,
        permanent: false,
      },
    };
  }
  // return /new if user is signed in.
  return {
    props: {}
  }
}

export default NewPet;
