import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Pet from "../../../models/Pet";
import User from "../../../models/Users";
import Product from "../../../models/products";
import Size from "../../../models/sizes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// import User from "../../models/Users";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // console.log('========req', req)
  // console.log('========res', res)

  const { query: { id }, method } = req;






  await dbConnect();
  // const client = dbConnect;
  // const db = client.db("test");
  // console.log('========dbConnect dd', dbConnect)
  // console.log('========db', db)
  // console.log('========dbConnect', dbConnect)
  // below we get our data now we need to findout how GET / POST / PUT / DELTE works in Reactjs
  // const users = await User.find({});
  // console.log('========users', users)

  switch (method) {
    case "GET"/* Get a model by its ID */:
      console.log('==========method from api/product/[id] GET HIT', method);

      try {
        // const pet = await Pet.findById(id);

        // // *********************ORIGINAL *********************************
        // const pet = await User.findById(id);
        // if (!pet) {
        //   return res.status(400).json({ success: false });
        // }
        // res.status(200).json({ success: true, data: pet });
        // console.log('==========method from api/pet/[id] GET HIT data', pet);
        // *********************ORIGINAL *********************************
        // console.log('========== api/pet/[id] GET HIT tregerd', id);

        const productFromAPI = await Product.findById(id).populate({ path: 'sizes', model: Size }).exec();
        if (!productFromAPI) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: productFromAPI });
        // res.status(200).json({ success: true, productFromAPI });
        // console.log('==========method from api/pet/[id] GET HIT data productFromAPI', productFromAPI);


      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        // console.log('==========method from api/pet/[id] PUT HIT', method);
        // console.log('==========req.body', req.body);

        // Product.findById({ _id: id },
        //   Product.findById(id)
        //     .then((foundProduct) => {
        //       console.log('==========foundProduct', foundProduct);
        //       res.status(200).json({ success: true, data: foundProduct });
        //     })
        //     .catch((err) => {
        //       console.log('=======err from index', err);
        //     })
        // // ================================ONHOLD====================================
        // update a product.
        const updateProduct = await Product.findByIdAndUpdate(
          { _id: id },
          {
            productName: req.body.productName,
            price: req.body.price,
            productImg: req.body.productImg,
            category: req.body.category,
            brand: req.body.brand,
            gender: req.body.gender,
            kids: req.body.kids,
            colors: req.body.colors,
            // size: req.body.size,
            author: req.body.author,
            inStock: req.body.inStock,
          },
          { new: true }
        );
        // Updating product sizes model by it's ID. req.body.sizes: has all the info of the size interface which is coming from editForm.tsx
        await Size.findByIdAndUpdate(
          { _id: req.body.sizes._id },
          req.body.sizes,
          { new: true }
        );
        if (!updateProduct) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: updateProduct });
        // // ================================ONHOLD====================================
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;

    case "DELETE" /* Delete a model by its ID */:
      console.log('====delete hit')
      try {
        // handle delete a product
        const deletedProduct = await Product.findByIdAndDelete({ _id: req.body.id });
        // Delete product related sizes
        const deleteSize = await Size.findByIdAndDelete({ _id: deletedProduct.sizes });
        if (!deletedProduct || !deleteSize) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
