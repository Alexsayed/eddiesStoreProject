// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "../../../lib/dbConnect";
// import Pet from "../../../models/Pet";
// import User from "../../../models/Users";
// import Product from "../../../models/products";
// // import User from "../../../models/Users";


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // console.log('========req', req)
//   // console.log('========req', req.query)
//   // console.log('========req.method', req.method)
//   const { query: { id }, method } = req;
//   console.log('==========iddddd', id);
//   // console.log('==========User', User);



//   await dbConnect();
//   // const client = dbConnect;
//   // const db = client.db("test");
//   // console.log('========dbConnect dd', dbConnect)
//   // console.log('========db', db)
//   // console.log('========dbConnect', dbConnect)
//   // below we get our data now we need to findout how GET / POST / PUT / DELTE works in Reactjs
//   // const users = await User.find({});
//   // console.log('========users', users)

//   switch (method) {
//     case "GET" /* Get a model by its ID */:
//       console.log('==========method from api/pet/[id] GET HIT', method);

//       try {
//         // const pet = await Pet.findById(id);

//         // // *********************ORIGINAL *********************************
//         // const pet = await User.findById(id);
//         // if (!pet) {
//         //   return res.status(400).json({ success: false });
//         // }
//         // res.status(200).json({ success: true, data: pet });
//         // console.log('==========method from api/pet/[id] GET HIT data', pet);
//         // *********************ORIGINAL *********************************
//         console.log('========== api/pet/[id] GET HIT tregerd', id);

//         const productFromAPI = await Product.findById(id);
//         if (!productFromAPI) {
//           return res.status(400).json({ success: false });
//         }
//         res.status(200).json({ success: true, data: productFromAPI });
//         // res.status(200).json({ success: true, productFromAPI });
//         // console.log('==========method from api/pet/[id] GET HIT data productFromAPI', productFromAPI);


//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;

//     case "PUT" /* Edit a model by its ID */:
//       try {
//         console.log('==========method from api/pet/[id] PUT HIT', method);
//         console.log('======api/pets/index HIT  PUT method activated req.body,', req.body)
//         console.log('======api/pets/index HIT  PUT method activated id', id)
//         // Product.findById({ _id: id },
//         //   Product.findById(id)
//         //     .then((foundProduct) => {
//         //       console.log('==========foundProduct', foundProduct);
//         //       res.status(200).json({ success: true, data: foundProduct });
//         //     })
//         //     .catch((err) => {
//         //       console.log('=======err from index', err);
//         //     })
//         // // ================================ ON HOLD ================================
//         // const updateProduct = await Product.findByIdAndUpdate(
//         //   { _id: id },
//         //   {
//         //     productName: req.body.productName,
//         //     price: req.body.price,
//         //     inStock: req.body.inStock,
//         //     author: req.body.author
//         //   },
//         //   { new: true }
//         // );
//         // if (!updateProduct) {
//         //   return res.status(400).json({ success: false });
//         // }
//         // res.status(200).json({ success: true, data: updateProduct });
//         // // ================================ ON HOLD ================================


//         // redirect("/api/pets");
//         // redirect('/');


//         // NewVideos.findByIdAndUpdate(
//         //   { _id: req.params.videoId },
//         //   { videoTitle: req.body.editVidTitle },
//         //   { new: true },
//         //   (err, videoData) => {
//         //     if (err) {
//         //       throw err;
//         //     } else {
//         //       res.redirect('back');
//         //     }
//         //   })
//         // const pet = await Pet.findByIdAndUpdate(id, req.body, {
//         //   new: true,
//         //   runValidators: true,
//         // });
//         // if (!pet) {
//         //   return res.status(400).json({ success: false });
//         // }
//         // res.status(200).json({ success: true, data: pet });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }

//       break;

//     case "DELETE" /* Delete a model by its ID */:
//       try {
//         console.log('==========method from api/pet/[id] Delete HIT', method);

//         const deletedPet = await Pet.deleteOne({ _id: id });
//         if (!deletedPet) {
//           return res.status(400).json({ success: false });
//         }
//         res.status(200).json({ success: true, data: {} });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;

//     default:
//       res.status(400).json({ success: false });
//       break;
//   }
// }
