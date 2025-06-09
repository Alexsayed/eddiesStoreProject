import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Form from "../../components/Form";
import EditForm from "../../components/editProduct/editForm";
import React from 'react';
// import { useParams } from 'next/navigation';
import dbConnect from "../../lib/dbConnect";
import Product, { Products } from "../../models/products";
// import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetServerSidePropsContext } from "next";
// import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Size from '../../models/sizes';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
interface Params extends ParsedUrlQuery {
  id: string;
}
type Props = {
  // productId is assigned below. with the help of (ParsedUrlQuery) we get params id.
  // productId: string;
  getProduct: Products;
};

// **************************************** Original *************************
// const fetcher = (url: string) =>
//   fetch(url)
//     .then((res) => res.json())
//     .then((json) => json.data);
// **************************************** Original *************************
// productId comes from line: 17 and line: 17 gets the params id from returned value at the bottom.
// const EditPet = ({ productId }: Props) => {
// **************************************** Original *************************
// fucking sign in shit, keep working of fucking edit restriction
const EditPet = ({ getProduct }: Props) => {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  // console.log('===============================,session', session)
  // console.log('===============================,status', status)
  // console.log('===============================')
  // console.log('===============================session.user.role', session)


  // **************************************** ON HOLD *************************


  // useEffect(() => {
  // If user is not signed in, redirect to the sign-in page with the current URL
  // if (status === "unauthenticated") {
  //   console.log('===============================router.asPath', router.asPath)

  //   router.push(`/auth/signin?redirect=${router.asPath}`); // ORIGINAL
  //   // router.push(`/auth/signin?redirect=${router.asPath}`); 
  //   // console.log('===============================status Not auth', status)

  // }
  // // }, [status, router]);
  // if (status === 'loading') {
  //   console.log('===============================,status', status)
  //   return <div>Loading...</div>;
  // }
  // // If authenticated, show the page content
  // if (status === "authenticated") {
  // **************************************** ON HOLD *************************


  // **************************************** ON HOLD *************************

  // if (!session) {
  //   console.log('===============================!session', session)

  //   // Redirect to sign-in page if not authenticated
  //   // router.push('/auth/signin');
  //   router.push(`/auth/signin?redirect=${router.asPath}`);
  //   return null;
  // }
  // if (session.user.role !== 'admin') {
  //   console.log('===============================session.user.role', session.user.role)

  //   // Redirect to a different page if the user is not an admin
  //   router.push('/');
  //   return null;
  // }
  // if (session.user.role === 'admin') {
  //   console.log('===============================admin', session.user.role);
  //   console.log('===============================session', session);
  //   console.log('===============================session', session.expires.toLocaleString());
  //   console.log('===============================date', Date.now.toString());

  //   // Redirect to a different page if the user is not an admin
  //   // router.push('/');
  //   // return null;
  // }
  // console.log('===============================session after', session)
  // **************************************** ON HOLD *************************


  // **************************************** ON HOLD *************************
  // const [getProducts, setProduct] = useState<any>({});
  // For us to edit a product, we need to fitch (retrieve) by it's ID. 
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     // Fitch data by it's ID from below URL            
  //     const response = await fetch('http://localhost:3000/api/products/' + productId);
  //     const data = await response.json();
  //     setProduct(data.data);
  //   }
  //   fetchUsers();
  // }, []);
  // **************************************** ON HOLD *************************






  // **************************************** Original *************************
  // fetcher("http://localhost:3000/api/pets/67546b2b96eb63212a35d4d2");
  // const { data: pet, error, isLoading, } = useSWR(id ? `/api/pets/${id}` : null, fetcher);
  // const { data: getProducts, error, isLoading, } = useSWR(id ? `http://localhost:3000/api/pets/67546b2b96eb63212a35d4d2` : null, fetcher);


  // if (error) return <p>Failed to load</p>;
  // if (isLoading) return <p>Loading...</p>;
  // if (!pet) return null;

  // const petForm = {
  //   name: pet.name,
  //   owner_name: pet.owner_name,
  //   species: pet.species,
  //   age: pet.age,
  //   poddy_trained: pet.poddy_trained,
  //   diet: pet.diet,
  //   image_url: pet.image_url,
  //   likes: pet.likes,
  //   dislikes: pet.dislikes,
  // };
  // return <Form formId="edit-pet-form" petForm={petForm} forNewPet={false} />;
  // **************************************** Original *************************  
  // next up:  create link to all products so we can pick whichever we want to update
  // if (status === "authenticated") {
  // console.log('===============================status auth', status)

  return (
    // Pass the data(getProducts) to components/editproduct/EditForm, which it has a fuction with 2 arg ( function editProduct({ formId1, product }) )  
    // <EditForm editFormId="edit-pet-form1" product={getProducts} />
    <EditForm editFormId="edit-pet-form1" product={getProduct} />
  )
  // }
  // return null; // This ensures that the page doesn't render before authentication check

};
// 
// export const getServerSideProps: GetServerSideProps<Props> = async () => {
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Step 1: Get the session to check if the user is authenticated
  const session = await getSession(context);
  // console.log('=============================== session', session)

  // Step 2: If no session, redirect the user to the signin page
  if (!session) {
    // console.log('=============================== context.resolvedUrl', context.resolvedUrl)

    const callbackUrl = encodeURIComponent(context.resolvedUrl);
    // const callbackUrl = context.resolvedUrl;
    // console.log('=============================== callbackUrl /edit', callbackUrl)

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
  // console.log('=============================== id edit page', id)
  const productResult = await Product.findById({ _id: id });
  // console.log('=============================== productResult', productResult)

  if (!productResult) {
    // console.log('======if edit ')

    return {
      notFound: true,
    };
  } else {
    const sizeField = productResult.gender === 'Women' ? 'womenSizes' : 'menSizes';
    await productResult.populate({ path: 'sizes', model: Size, select: sizeField });
    const stringifyProduct = JSON.parse(JSON.stringify(productResult));
    // const paramsId = JSON.parse(JSON.stringify(params.id));
    return {
      props: {
        // assign paramsId to productId, which is defind at the top of our code. line: 21
        // productId: paramsId,
        // assign stringifyProduct to getProduct, which is defind at the top of our code. line: 22
        getProduct: stringifyProduct,
      },
    };
  }
}
// export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
// **************************************** ON HOLD *************************
// export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params }: GetServerSidePropsContext) => {
//   await dbConnect();
//   console.log('===============================params', params)


//   if (params) {
//     // Access the property of params.ID; only if the params object is defined.
//     params.id;
//   } else {
//     return {
//       notFound: true,
//     };
//   }
//   const productResult = await Product.findById({ _id: params.id });
//   if (!productResult) {
//     console.log('======if edit ')

//     return {
//       notFound: true,
//     };
//     // }
//   } else {
//     const sizeField = productResult.gender === 'Women' ? 'womenSizes' : 'menSizes';
//     await productResult.populate({ path: 'sizes', model: Size, select: sizeField });
//     const stringifyProduct = JSON.parse(JSON.stringify(productResult));
//     // const paramsId = JSON.parse(JSON.stringify(params.id));
//     return {
//       props: {
//         // assign paramsId to productId, which is defind at the top of our code. line: 21
//         // productId: paramsId,
//         // assign stringifyProduct to getProduct, which is defind at the top of our code. line: 22
//         getProduct: stringifyProduct,
//       },
//     };
//   }
// };
//   // **************************************** ON HOLD *************************

export default EditPet;
