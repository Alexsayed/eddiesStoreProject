// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "../../../lib/dbConnect";
// import Pet from "../../../models/Pet";
// import User from "../../../models/Users";
// import Product from "../../../models/products";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   console.log('======api/pets/index HIT')
//   console.log('======api/pets/index HIT method', method)
//   await dbConnect();

//   switch (method) {
//     case "GET":
//       try {
//         // const pets = await Pet.find({}); /* find all the data in our database */
//         // res.status(200).json({ success: true, data: pets });

//         // // ************************ ORIGINAL *****************
//         // const result = await User.find({});
//         // res.status(200).json({ success: true, data: result });
//         // // ************************ ORIGINAL *****************



//         const productResult = await Product.find({});
//         res.status(200).json({ success: true, data: productResult });
//         // console.log('=======result from index', productResult)
//         // // ************************ ON HOLD *****************
//         // Product.create({
//         //   productName: 'Milk',
//         //   price: 20,
//         //   inStock: true,
//         //   productImg: 'https://img.freepik.com/free-photo/photorealistic-view-tree-nature-with-branches-trunk_23-2151478028.jpg',
//         //   author: 'AlexSayed'
//         // }).then((createdProduct) => {
//         //   console.log('=======createdProductt from index', createdProduct)

//         // }).catch((err) => {
//         //   console.log('=======err from index', err)
//         // })
//         // // ************************ ON HOLD *****************

//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case "POST":
//       try {
//         // const pet = await Pet.create(
//         //   req.body,
//         // ); /* create a new model in the database */
//         // res.status(201).json({ success: true, data: pet });


//         console.log('======api/pets/index HIT  POST method activated', method)
//         console.log('======api/pets/index HIT  POST method activated req.body,', req.body)



//         // Product.create({
//         //   productName: req.body.productName,
//         //   price: req.body.price,
//         //   productImg: req.body.productImg,
//         //   author: req.body.author,
//         //   inStock: req.body.inStock,
//         // }).then((createdProduct) => {
//         //   console.log('=======createdProductt from index POST request', createdProduct)

//         // }).catch((err) => {
//         //   console.log('=======err from index', err);
//         // })
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     default: res.status(400).json({ success: false });
//       break;
//   }

// }
