import Link from "next/link";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import dbConnect from "../lib/dbConnect";
import { ParsedUrlQuery } from "querystring";

// import Pet, { Pets } from "../models/Pet";
// import Pet, { Users } from "../models/Users";
// import User from "../models/Users";
import Product, { Products } from "../models/products";
import Size, { ISizes } from '../models/sizes';
import HomePage from "../components/home/landingPage";
import MenuBar from "../components/menu/menu";
import NavBar from "../components/navbar/navbar";


// type Props = {
//   pets: Pets[];
// };

// type Props = {
//   pets: Users[];
// };
type Product = {
  // name: string;
  // price: number;
  sizes: ISizes[];
  // Add other fields for products
};
// type Props = {
//   allProducts: Products[];
//   searchQuery?: string;

// };
interface Props {
  // searchQuery?: string; 
  allProducts: Products[];
}



// const Index = ({ pets }: Props) => {
const Index = ({ allProducts }: Props) => {
  // const [getProducts1, setProduct1] = useState<any>({});
  // useEffect(() => {
  //   setProduct1(products1)
  // })
  // const data = {} as any;

  // console.log('=============, products1 index', allProducts)

  // const [searchQuery, setSearchQuery] = useState<string>('');
  // const handleSearch = (query: string) => {
  //   console.log('=======handleSearch HIT', query)
  //   setSearchQuery(query);
  //   console.log('=======handleSearch searchQuery', searchQuery)

  // };
  return (
    <>
      {/* <NavBar onSearch={handleSearch} /> */}
      {/* < HomePage getAllProducts={allProducts} searchQuery={searchQuery ?? ''} /> */}
      {/* < MenuBar menuData={''} /> */}
      < HomePage getAllProducts={allProducts} />

      {/* <div>ddjdjdjfffff</div> */}
      {/* {pets.map((pet) => (
        <div key={pet._id} >
          <div className="card">
            <img src={pet.image_url} />
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>

              Extra Pet Info: Likes and Dislikes
              <div className="likes info">
                <p className="label">Likes</p>
                <ul>
                  {pet.likes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>
              <div className="dislikes info">
                <p className="label">Dislikes</p>
                <ul>
                  {pet.dislikes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>

              <div className="btn-container">
                <Link href={{ pathname: "/[id]/edit", query: { id: pet._id } }}>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href={{ pathname: "/[id]", query: { id: pet._id } }}>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))} */}
    </>
  )
};
// // =================================ORIGINAL =========================\
/* Retrieves pet(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // // =================================ORIGINAL =========================\
  // export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, }: GetServerSidePropsContext) => {
  await dbConnect();





  // // =================================ORIGINAL =========================\

  // const productsResult = await Product.find({});
  // if (!productsResult) {
  //   return {
  //     notFound: true,
  //   };
  // }
  // var stringifyAllProduct = JSON.parse(JSON.stringify(productsResult));
  // return { props: { allProducts: stringifyAllProduct } };
  // // =================================ORIGINAL =========================
  /* find all the data in our database */
  // const result = await Pet.find({});
  // const productsResult = await Product.find({})
  // const getsizes = await Size.find({});
  // console.log('=====getsizes', getsizes)
  // fing Size model won't get here so there for it throw error, maybe i need to give a condition befor displaying sizes







  // console.log('=========productsResult ahah', productsResult);
  // console.log('=======createdProductt from index POST request', createdProduct)






  // console.log('=========stringifyAllProduct', stringifyAllProduct);

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  // const pets = result.map((doc) => {
  // const products2 = productsResult.map((doc) => {
  //   // const pet = JSON.parse(JSON.stringify(doc));
  //   const product3 = JSON.parse(JSON.stringify(doc));

  //   // return pet;
  //   return product3;
  // });
  // return { props: { pets: pets } };
  // return { props: { products1: products2 } };
  // return { props: { allProducts: stringifyAllProduct } };

  try {

    // const productsResult = await Product.find({}).populate("sizes").exec();
    // To Populate mogoose model we HAVE TO populate it like below: populate({ path: 'sizes', model: Size }) otherwise won't work.
    const productsResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
    const stringifyAllProduct = JSON.parse(JSON.stringify(productsResult));
    return { props: { allProducts: stringifyAllProduct, } };
  } catch (err) {
    return { props: { allProducts: [], } };
  }



};

export default Index;
