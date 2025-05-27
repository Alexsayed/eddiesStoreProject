import { createContext, useState } from "react";
import { useRouter } from "next/router";
import ProductPage from "../../components/home/product";
import Navbar from "../../components/navbar/navbar";

import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
// import Pet, { Pets } from "../../models/Pet";
import Product, { Products } from "../../models/products";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import Size from '../../models/sizes';

console.log('======[id]/index HIT')
interface Params extends ParsedUrlQuery {
  id: string;
}

type Props = {
  getProduct: Products;
  // username: string

};
// in Case i lose the searct: how to update shopping cart in Navbar.tsx when we click add to cart from Product.tsx





/* Allows you to view pet card info and delete pet card*/
// const PetPage = ({ pet }: Props) => {
const PetPage = ({ getProduct, }: Props) => {
  const router = useRouter();
  // const [message, setMessage] = useState("");
  const [message, setMessage] = useState('Hello, world!');


  // next time: try to do it like below
  // const handleDelete = async () => {
  //   const petID = router.query.id;

  //   try {
  //     // await fetch(`/api/pets/${petID}`, {
  //     await fetch(`/productss/${petID}`, {
  //       method: "Delete",
  //     });
  //     router.push("/");
  //   } catch (error) {
  //     setMessage("Failed to delete the pet.");
  //   }
  // };
  // console.log('==============getProduct from [id]/index', getProduct)


  return (

    // <CurrentUserContext.Provider value={currentUser}> 
    <>
      {/* < ProductPage editFormId="edit-pet-form12" productData={getProduct} /> */}
      < ProductPage productData={getProduct} />



    </>
    // </CurrentUserContext.Provider>
    // 

    // <>

    //   <div>ddd</div>

    //   <div key={pet._id}>
    //     <div>We are in .pages/[id]/index</div>
    //     <div className="card">
    //       <img src={pet.image_url} />
    //       <h5 className="pet-name">{pet.name}</h5>
    //       <div className="main-content">
    //         <p className="pet-name">{pet.name}</p>
    //         <p className="owner">Owner: {pet.owner_name}</p>

    //         {/* Extra Pet Info: Likes and Dislikes */}
    //         <div className="likes info">
    //           <p className="label">Likes</p>
    //           <ul>
    //             {pet.likes.map((data, index) => (
    //               <li key={index}>{data} </li>
    //             ))}
    //           </ul>
    //         </div>
    //         <div className="dislikes info">
    //           <p className="label">Dislikes</p>
    //           <ul>
    //             {pet.dislikes.map((data, index) => (
    //               <li key={index}>{data} </li>
    //             ))}
    //           </ul>
    //         </div>

    //         <div className="btn-container">
    //           <Link href={`/${pet._id}/edit`}>
    //             <button className="btn edit">Edit</button>
    //           </Link>
    //           <button className="btn delete" onClick={handleDelete}>
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //     {message && <p>{message}</p>}
    //   </div>
    // </>
  );
};


export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, }: GetServerSidePropsContext) => {
  await dbConnect();

  // if (!params?.id) {
  //   return {
  //     notFound: true,
  //   };
  // }
  if (params) {
    // Access the property of params.ID; only if the params object is defined.
    params.id;
  } else {
    return {
      notFound: true,
    };
  }
  console.log('========params.id;', params.id)
  // if (params.id === 'newItems' || 'mens' || 'womens' || 'brands') {
  //   console.log('========params.id inside;', params.id)
  //   const productResult1 = await Product.find({ $or: [{ id: params.id }, { productName: params.id }, { brand: params.id }, { gender: params.id }] });
  //   console.log('========productResult inside', productResult1)

  //   // } else {
  // }
  // const productResult = await Product.find({ $or: [{ _id: params.id }, { productName: params.id }, { brand: params.id }, { gender: params.id }] });
  // // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )

  // // console.log('========productResult1', productResult1)

  // // db.articles.find( { $text: { $search: "coffee" } } )
  // for (let i = 0; i < productResult.length; i++) {
  //   if (productResult[i]._id.toString() === params.id) {
  //     console.log('========params.id; equal', params.id)
  //     console.log('========productResult[i]._id; equal', productResult[i]._id)

  //   } else {
  //     console.log('========params.id; not equal', typeof params.id);
  //     console.log('========productResult[i]._id; Not equal', typeof productResult[i]._id)


  //   }
  // }

  // Find product by it's ID
  const productResult = await Product.findById({ _id: params.id });

  console.log('========productResult form index', productResult)
  if (!productResult) {
    return {
      notFound: true,
    };
  };
  // Selecting the Size field based on gender of the product.  
  const sizeField = productResult.gender === 'Women' ? 'womenSizes' : 'menSizes';
  // Populate the Size model.
  await productResult.populate({ path: 'sizes', model: Size, select: sizeField });

  // const pet = await Pet.findById(params.id).lean();



  const stringifyProduct = JSON.parse(JSON.stringify(productResult));
  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  // const serializedPet = JSON.parse(JSON.stringify(pet));
  console.log('==============stringifyProduct index.tsx', stringifyProduct)




  return {
    props: {
      getProduct: stringifyProduct,
      // username: 'dd'

    },
  };
};

export default PetPage;

